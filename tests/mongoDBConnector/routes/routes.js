let { Route, MiddlewareProvider } = require("../../../index.js"),
	MainController = require("../controllers/MainController/MainController.js");

module.exports = [
	Route.post("/insertOne", MainController, "insertOne"),
	Route.get("/findById/{id}", MainController, "findById"),
	Route.post("/findAllWithAttribute", MainController, "findAllWithAttribute"),
	Route.post("/updateById/{id}", MainController, "updateById"),
	Route.delete("/deleteById/{id}", MainController, "deleteById")
];
