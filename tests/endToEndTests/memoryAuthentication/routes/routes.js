let { Route, MiddlewareProvider } = require("../../../../index.js");

module.exports = [
	Route.post("/login", require("../controllers/MainController/MainController.js"), "login")
];
