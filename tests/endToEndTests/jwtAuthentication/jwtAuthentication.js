let { WombatServer, Route, MiddlewareProvider, Config } = require("../../../index.js"),
	JwtAuthenticationController = require("./controllers/JwtAuthenticationController/JwtAuthenticationController.js"),
	request = require("request"),
	{ join } = require("path");

Config.setConfigFolder(join(__dirname, 'config'));

WombatServer.withoutDatabase().setUnsecure().setRoutes([
	Route.get("/public", JwtAuthenticationController, "public"),
	Route.get("/authenticationRequired", JwtAuthenticationController, "authenticationRequired", [
		MiddlewareProvider.getMiddleware("JwtAuthenticationMiddleware")
	]),
]).init(() => {
	let runnedTests = 0,
		finishTest = () => {
			runnedTests++;
			if (runnedTests === 2) {
				process.exit();
			}
		};
	request.get("http://localhost:8888/public", (error, response, body) => {
		if (!error){
			if (body === "OK"){
				finishTest();
			}
			else{
				throw new Error("Request returned another response than 'OK'.");
			}
		}
		else{
			throw error;
		}
	});
	let authenticationRequiredURL = "http://localhost:8888/authenticationRequired",
		jwt = require("jsonwebtoken").sign({
			username: "foo"
		}, require("./config/auth.js").signKey),
		jwtCookie = request.cookie("jwt=" + jwt),
		jar = request.jar();
	jar.setCookie(jwtCookie, authenticationRequiredURL);
	request({
		url: authenticationRequiredURL,
		jar
	}, (error, response, body) => {
		if (!error){
			if (body === "OK"){
				finishTest();
			}
			else{
				throw new Error("Request returned another response than 'OK'.");
			}
		}
		else{
			throw error;
		}
	});
});