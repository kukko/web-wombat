let { Route, MiddlewareProvider } = require("../../../../index.js");

module.exports = [
	Route.post("/login", require("../controllers/RedirectUnauthorizedController/RedirectUnauthorizedController.js"), "login"),
	Route.get("/userArea", require("../controllers/RedirectUnauthorizedController/RedirectUnauthorizedController.js"), "userArea", [
		MiddlewareProvider.getMiddleware("JwtAuthenticationMiddleware", {
			return403ForUnauthenticated: false
		}),
		MiddlewareProvider.getMiddleware("RedirectUnauthorizedMiddleware", {
			redirectRouteAlias: 'unauthorized'
		})
	]),
	Route.get("/unauthorized", require("../controllers/RedirectUnauthorizedController/RedirectUnauthorizedController.js"), "unauthorized").as('unauthorized')
];
