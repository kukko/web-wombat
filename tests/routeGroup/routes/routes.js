let { Route, RouteGroup, MiddlewareProvider } = require("../../../index.js"),
	UserController = require("../controllers/UserController/UserController.js");

module.exports = [
	new RouteGroup("/user", [
		Route.post("/login", UserController, "login"),
		Route.get("/logout", UserController, "logout"),
		new RouteGroup("/admin", [
			Route.get("/edit", UserController, "edit"),
			Route.delete("/delete", UserController, "delete")
		])
	])
];
