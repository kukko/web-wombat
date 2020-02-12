let BaseMiddleware = require("../BaseMiddleware.js");

class JsonBodyParserMiddleware extends BaseMiddleware {
	static run(request, response, next) {
		if (["POST", "PUT", "UPDATE"].indexOf(request.method) !== -1 && request.headers['content-type'].indexOf('application/json;') !== -1) {
			request.body = JSON.parse(request.rawBody);
		}
		next();
	}
}

module.exports = JsonBodyParserMiddleware;
