let BaseMiddleware = require("../BaseMiddleware.js");

class JwtAuthenticationMiddleware extends BaseMiddleware {
	static run(request, response, next, params) {
		if (typeof params['signKey'] === "undefined"){
			params['signKey'] = require(join(
				dirname(require.main.filename),
					"config",
					"auth.js"
				)).signKey;
		}
		if (typeof params['return403ForUnauthenticated'] === "undefined"){
			params['return403ForUnauthenticated'] = true;
		}
		let jwt = require("jsonwebtoken"),
			{ join, dirname } = require("path");
		try {
			let token = request.cookies["jwt"];
			request.user = jwt.verify(token, params.signKey);
			request.authenticated = true;
			next();
		} catch (e) {
			request.authenticated = false;
			if (params['return403ForUnauthenticated']){
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
