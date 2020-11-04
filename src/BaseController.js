let DatabaseHolder = require("./DatabaseHolder.js"),
	logger = require("./Logger.js");

class BaseController {
	constructor(request, response) {
		this.request = request;
		this.response = response;
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
	setViewConnector(viewConnector) {
		this.viewConnector = viewConnector;
	}
	static getAllMiddlewares() {
		return [...this.getBaseMiddlewares(), ...this.getMiddlewares()];
	}
	static getBaseMiddlewares() {
		return [
			this.middlewareProvider.getMiddleware("CookieParserMiddleware"),
			this.middlewareProvider.getMiddleware("RouteVariableParserMiddleware")
		];
	}
	static getMiddlewares() {
		return [];
	}
	redirect(url) {
		this.response.statusCode = 302;
		this.response.setHeader("Location", url);
		this.response.end();
	}
	setCookie(name, value) {
		BaseController.CookieService.setCookie(this.request, this.response, name, value);
	}
}

BaseController.middlewareProvider = require("./MiddlewareProvider.js");
BaseController.CookieService = require("./services/CookieService/CookieService");
BaseController.ViewProvider = require("./ViewProvider.js");

module.exports = BaseController;
