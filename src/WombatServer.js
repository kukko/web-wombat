let DatabaseHolder = require("./DatabaseHolder.js"),
	RouteService = require("./services/RouteService.js"),
	BaseController = require("./BaseController.js"),
	ViewProvider = require("./ViewProvider.js"),
	WebMiddlewares = require("./MiddlewareProvider.js").getWebMiddlewares(),
	TemplateInterface = require("./TemplateConnectors/TemplateInterface.js");

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
					console.log(error);
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
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
			let { readFileSync } = require("fs"),
				{ resolve, dirname, join } = require("path"),
				privateKey = readFileSync(
					resolve(
						dirname(require.main.filename),
						join("config", "secureKey", "key.pem")
					)
				).toString(),
				certificate = readFileSync(
					resolve(
						dirname(require.main.filename),
						join("config", "secureKey", "certificate.pem")
					)
				).toString();
			let https = require("https")
				.createServer(
					{
						key: privateKey,
						cert: certificate
					},
					this.serve
				)
				.on("listening", () => {
					console.log("Listening on 443!");
					finish();
				})
				.on("upgrade", this.serveWebSocket)
				.on("error", (error) => {
					console.log(error);
					throw error;
				})
				.on("clientError", (error) => {
					console.log(error);
				})
				.listen(443);
		}
		let server = require("http").createServer(this.serve);
		server
			.on("listening", () => {
				console.log("Listening on " + this.port + "!");
				finish();
			})
			.on("upgrade", this.serveWebSocket)
			.on("error", (error) => {
				console.log(error);
				throw error;
			})
			.on("clientError", (error) => {
				console.log(error);
			})
			.listen(this.port);
	}
	static serve(request, response) {
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
					filePath =
						request.url.indexOf("?") === -1
							? request.url
							: request.url.substr(0, request.url.indexOf("?")),
					resourcePath = path.join(
						path.dirname(require.main.filename),
						filePath
					);
				if (fileSystem.existsSync(resourcePath)) {
					let responseHeaders = {};
					if (typeof this.mime === "undefined") {
						this.mime = require("mime");
					}
					responseHeaders["Content-type"] = this.mime.getType(
						resourcePath
					);
					response.writeHead(200, responseHeaders);
					fileSystem.createReadStream(resourcePath).pipe(response);
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
	static setTemplateConnector(connector) {
		if (!(new connector() instanceof TemplateInterface)) {
			throw new Error(
				"The " +
					connector.constructor.name +
					" is not extending the TemplateInterface class."
			);
		}
		ViewProvider.setDefaultConnector(connector);
		return this;
	}
}

WombatServer.port = 8888;

WombatServer.connectToDatabase = true;

WombatServer.secureConnection = true;

module.exports = WombatServer;
