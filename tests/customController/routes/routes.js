let { Route, MiddlewareProvider } = require("../../../index.js");

module.exports = [
	Route.get("/", require("../controllers/MainController/MainController.js"))
];
