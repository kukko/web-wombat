let DatabaseHolder = require("./DatabaseHolder.js"),
	RouteService = require("./services/ServiceProvider.js").getRouteService(),
	BaseController = require("./BaseController.js"),
	ViewProvider = require("./ViewProvider.js"),
	MiddlewareProvider = require("./MiddlewareProvider.js"),
	TemplateInterface = require("./TemplateConnectors/TemplateInterface.js"),
	logger = require("./Logger.js");

class WombatServer {
	static init(callback) {
		if (typeof WombatServer.subfolder === "undefined") {
			this.setSubfolder(".");
		}
		if (typeof this.getRoutes() === "undefined") {
			let { resolve, dirname, join } = require("path"),
				{ existsSync } = require("fs"),
				routesFile = resolve(
					dirname(require.main.filename),
					join("routes", "routes.js")
				);
			if (existsSync(routesFile)) {
				this.setRoutes(require(routesFile));
			} else {
				throw new Error("No routes provided.");
			}
		}
		if (this.connectToDatabase) {
			DatabaseHolder.connect()
				.then((databaseResult) => {
					this.listen(callback);
				})
				.catch((error) => {
					logger.log(error);
				});
		} else {
			this.listen(callback);
		}
	}
	static withDatabase() {
		this.connectToDatabase = true;
		return this;
	}
	static withoutDatabase() {
		this.connectToDatabase = false;
		return this;
	}
	static setPort(port) {
		this.port = port;
		return this;
	}
	static getPort() {
		return this.port;
	}
	static setSecurePort(securePort) {
		this.securePort = securePort;
		return this;
	}
	static getSecurePort() {
		return this.securePort;
	}
	static setRoutes(routes) {
		RouteService.setRoutes(routes);
		return this;
	}
	static getRoutes() {
		return RouteService.getRoutes();
	}
	static setSubfolder(subfolder) {
		this.subfolder = subfolder;
		ViewProvider.setSubfolder(subfolder);
		return this;
	}
	static setUnsecure() {
		this.secureConnection = false;
		return this;
	}
	static setSecure() {
		this.secureConnection = true;
		return this;
	}
	static setHttpsOptions(httpsOptions){
		this.httpsOptions = httpsOptions;
		return this;
	}
	static getHttpsOptions(){
		return this.httpsOptions;
	}
	static listen(callback) {
		let listening = 0,
			finish = () => {
				listening++;
				if (
					listening === (this.secureConnection ? 2 : 1) &&
					typeof callback !== "undefined"
				) {
					callback(this.port);
				}
			};
		if (this.secureConnection) {
			let privateKey = this.getCertificate("privateKey"),
				certificate = this.getCertificate("certificate");
			let https = require("https")
				.createServer(
					{
						...(typeof this.httpsOptions !== "undefined" ? this.httpsOptions : {}),
						key: privateKey,
						cert: certificate
					},
					this.serve
				)
				.on("listening", () => {
					logger.log("Listening on " + this.getSecurePort() + "!");
					finish();
				})
				.on("upgrade", this.serveWebSocket)
				.on("error", (error) => {
					logger.log(error);
					throw error;
				})
				.on("clientError", (error) => {
					logger.log(error);
				})
				.listen({
					port:this.getSecurePort()
				});
		}
		let server = require("http").createServer(this.serve);
		server
			.on("listening", () => {
				logger.log("Listening on " + this.port + "!");
				finish();
			})
			.on("upgrade", this.serveWebSocket)
			.on("error", (error) => {
				logger.log(error);
				throw error;
			})
			.on("clientError", (error) => {
				logger.log(error);
			})
			.listen({
				port:this.getPort()
			});
	}
	static serveWithMiddlewares(request, response) {
		MiddlewareProvider.runMiddlewares(
			request,
			response,
			this.serve,
			MiddlewareProvider.getWebMiddlewares
		);
	}
	static serve(request, response) {
		MiddlewareProvider.runMiddlewares(
			request,
			response,
			WombatServer.serveRequest,
			MiddlewareProvider.getWebMiddlewares()
		);
	}
	static serveRequest(request, response){
		let route = RouteService.getRoute(request);
		if (typeof route !== "undefined") {
			request.route = route;
			route.serve(request, response);
		} else {
			let path = require("path");
			if (path.extname(request.url).length === 0) {
				response.statusCode = 404;
				let controller = new BaseController(request, response);
				controller.view("404", {}).catch((error) => {
					response.end("404");
				});
			} else {
				let fileSystem = require("fs"),
					filePath;
				if (request.url.indexOf("?") === -1) {
					filePath = request.url;
				} else {
					filePath = request.url.substr(
						0,
						request.url.indexOf("?")
					);
				}
				let resourcePath = path.join(
					path.dirname(require.main.filename),
					filePath
				);
				if (fileSystem.existsSync(resourcePath)) {
					let responseHeaders = {};
					if (typeof WombatServer.mime === "undefined") {
						WombatServer.mime = require("mime");
					}
					responseHeaders["Content-type"] = WombatServer.mime.getType(
						resourcePath
					);
					response.writeHead(200, responseHeaders);
					fileSystem
						.createReadStream(resourcePath)
						.pipe(response);
				} else {
					response.writeHead(404);
					response.end("404");
				}
			}
		}
	}
	static serveWebSocket(request, socket, head) {
		let route = RouteService.getRoute(request);
		if (typeof route !== "undefined") {
			request.route = route;
			route.serveWebSocket(request, socket, head);
		}
	}
	static setTemplateConnector(Connector) {
		if (!(Connector.prototype instanceof TemplateInterface)) {
			throw new Error(
				"The " +
					Connector.prototype.constructor.name +
					" is not extending the TemplateInterface class."
			);
		}
		ViewProvider.setDefaultConnector(Connector);
		return this;
	}
	static getCertificate(part){
		if (typeof this.certificate === "undefined" || (typeof part === "undefined" || typeof this.certificate[part] === "undefined")){
			let { readFileSync } = require("fs"),
				{ resolve, dirname, join } = require("path");
			this.certificate = {};
			if (typeof part === "undefined" || part === "privateKey"){
				this.certificate["privateKey"] = readFileSync(
					resolve(
						dirname(require.main.filename),
						join("config", "secureKey", "key.pem")
					)
				).toString();
			}
			if (typeof part === "undefined" || part === "certificate"){
				this.certificate["certificate"] = readFileSync(
					resolve(
						dirname(require.main.filename),
						join("config", "secureKey", "certificate.pem")
					)
				).toString();
			}
		}
		return typeof part === "undefined" ? this.certificate : this.certificate[part];
	}
	static setCertificate(certificate){
		if (typeof certificate.privateKey === "undefined"){
			throw new Error("The `privateKey` property didn't setted in the certificate.");
		}
		if (typeof certificate.certificate === "undefined"){
			throw new Error("The `certificate` property didn't setted in the certificate.");
		}
		this.certificate = certificate;
		return this;
	}
}

WombatServer.setPort(8888);

WombatServer.setSecurePort(443);

WombatServer.connectToDatabase = true;

WombatServer.secureConnection = true;

module.exports = WombatServer;
