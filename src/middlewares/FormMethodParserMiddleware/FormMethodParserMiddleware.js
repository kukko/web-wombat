let BaseMiddleware = require("../BaseMiddleware.js");

class FormMethodParserMiddleware extends BaseMiddleware {
	static run(request, response, next) {
		if (
			request.method === "POST" &&
			typeof request.body !== "undefined" &&
			typeof request.body._form_method !== "undefined"
		) {
			request.method = request.body._form_method;
		}
		next();
	}
}

module.exports = FormMethodParserMiddleware;
