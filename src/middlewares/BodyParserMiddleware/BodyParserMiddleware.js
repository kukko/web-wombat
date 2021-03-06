let BaseMiddleware = require("../BaseMiddleware.js");

class BodyParserMiddleware extends BaseMiddleware {
	static run(request, response, next) {
		if (["POST", "PUT", "PATCH", "DELETE"].indexOf(request.method) !== -1 && typeof request.body === 'undefined') {
			request.body = require("querystring").parse(request.rawBody);
		}
		next();
	}
}

module.exports = BodyParserMiddleware;
