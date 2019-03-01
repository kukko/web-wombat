let BaseMiddleware = require("../BaseMiddleware.js");

class CookieParserMiddleware extends BaseMiddleware {
	static run(request, response, next) {
		let cookie = require("cookie");
		request.cookies = cookie.parse(
			typeof request.headers["cookie"] !== "undefined"
				? request.headers["cookie"]
				: ""
		);
		next();
	}
}

module.exports = CookieParserMiddleware;