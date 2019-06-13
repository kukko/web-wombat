let BaseMiddleware = require("../BaseMiddleware.js");

class JwtAuthenticationMiddleware extends BaseMiddleware {
	static run(request, response, next) {
		let jwt = require("jsonwebtoken"),
			{ join, dirname } = require("path"),
			signKey = require(join(
			dirname(require.main.filename),
				"config",
				"auth.js"
			)).signKey,
			token = request.cookies["jwt"];
		try {
			request.user = jwt.verify(token, signKey);
			console.log(request.user);
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
