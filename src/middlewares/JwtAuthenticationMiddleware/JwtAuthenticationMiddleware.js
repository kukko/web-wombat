let BaseMiddleware = require("../BaseMiddleware.js");

class JwtAuthenticationMiddleware extends BaseMiddleware {
	static run(request, response, next) {
		let jwt = require("jsonwebtoken"),
			signKey = require("../../../../config/auth.js").signKey,
			token = request.cookies["jwt"];
		try {
			jwt.verify(token, signKey);
			next();
		} catch (e) {
			let ViewProvider = require("../../ViewProvider.js"),
				viewProviderObj = new ViewProvider(request, response);
			response.statusCode = 403;
			viewProviderObj.getView("403");
		}
	}
}

module.exports = JwtAuthenticationMiddleware;
