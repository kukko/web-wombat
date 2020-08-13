let DatabaseHolder = require("./DatabaseHolder.js"),
	logger = require("./Logger.js");

class BaseController {
	constructor(request, response) {
		this.request = request;
		this.response = response;
	}
	get db() {
		return new Proxy(DatabaseHolder, {
			get(target, name, receiver) {
				if (typeof target[name] !== "undefined") {
					if (typeof target.collections[name] !== "undefined") {
						throw new Error(
							"Resolved keyword (" +
							name +
							") used as collection name for " +
							target.collections[name].name +
							"."
						);
					}
				} else {
					if (typeof target.collections[name] !== "undefined") {
						return target.collections[name];
					}
					return null;
				}
			}
		});
	}
	serve() {
		logger.warn(
			"Not implemented 'serve' method in class: " + this.constructor.name + "!"
		);
	}
	view(filePath, options, writeToResponse = true, endResponse = true) {
		let viewProviderObj = new BaseController.ViewProvider(
			this.request,
			this.response,
			this.viewConnector
		);
		return viewProviderObj.getView(
			filePath,
			options,
			writeToResponse,
			endResponse
		);
	}
	static getMiddleware(name) {
		return BaseController.middlewareProvider.getMiddleware(name);
	}
	setViewConnector(viewConnector) {
		this.viewConnector = viewConnector;
	}

	static get allMiddlewares() {
		return [...this.baseMiddlewares, ...this.middlewares];
	}
	static get baseMiddlewares() {
		return [
			this.getMiddleware("CookieParserMiddleware"),
			this.getMiddleware("RouteVariableParserMiddleware")
		];
	}
	static get middlewares() {
		return [];
	}

	redirect(url) {
		this.response.statusCode = 302;
		this.response.setHeader("Location", url);
		this.response.end();
	}
	setCookie(name, value) {
		this.CookieService.setCookie(this.request, this.response, name, value);
	}
}

if (typeof BaseController.middlewareProvider === "undefined") {
	BaseController.middlewareProvider = require("./MiddlewareProvider.js");
}

if (typeof BaseController.CookieService === "undefined") {
	BaseController.CookieService = require("./services/CookieService/CookieService");
}

if (typeof BaseController.ViewProvider === "undefined") {
	BaseController.ViewProvider = require("./ViewProvider.js");
}

module.exports = BaseController;
