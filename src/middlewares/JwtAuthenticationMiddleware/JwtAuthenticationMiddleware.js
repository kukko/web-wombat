let BaseMiddleware = require("../BaseMiddleware.js");

class JwtAuthenticationMiddleware extends BaseMiddleware {
	static run(request, response, next, params) {
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
			request.authenticated = true;
			next();
		} catch (e) {
			request.authenticated = false;
			if (!params['return403ForUnauthenticated']){
				let ViewProvider = require("../../ViewProvider.js"),
					viewProviderObj = new ViewProvider(request, response);
				response.statusCode = 403;
				viewProviderObj.getView("403");
			}
			else{
				next();
			}
		}
	}
}

module.exports = JwtAuthenticationMiddleware;
