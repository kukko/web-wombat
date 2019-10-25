let BaseMiddleware = require("../BaseMiddleware.js");

class RedirectUnauthorizedMiddleware extends BaseMiddleware {
	static run(request, response, next, params) {
		if (!request.authenticated){
			let isRedirectURLSetted = typeof params.redirectURL !== "undefined",
				isRedirectRouteSetted = typeof params.redirectRouteAlias !== "undefined";
			if (!isRedirectURLSetted && !isRedirectRouteSetted){
				response.statusCode = 302;
				response.setHeader("Location", "/");
				response.end();
			}
			if (isRedirectURLSetted){
				response.statusCode = 302;
				response.setHeader("Location", params.redirectURL);
				response.end();
			}
			else if (isRedirectRouteSetted){
				let RouteService = require("../../services/ServiceProvider.js").getRouteService(),
					redirectParameters = typeof params.redirectRouteParameters !== "undefined" ? params.redirectRouteParameters : {},
					redirectURL = RouteService.getRouteByAlias(params.redirectRouteAlias, redirectParameters);
				response.statusCode = 302;
				response.setHeader("Location", redirectURL);
				response.end();
			}
		}
		else{
			next();
		}
	}
}

module.exports = RedirectUnauthorizedMiddleware;
