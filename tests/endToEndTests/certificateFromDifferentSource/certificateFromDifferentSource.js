let { WombatServer, Route } = require("../../../index.js"),
	{ readFileSync } = require("fs"),
	{ resolve, dirname, join } = require("path"),
	privateKey = readFileSync(
		resolve(
			dirname(require.main.filename),
			join("keys", "private.key")
		)
	).toString(),
	certificate = readFileSync(
		resolve(
			dirname(require.main.filename),
			join("keys", "certificate.crt")
		)
	).toString(),
	request = require("request");

WombatServer.setRoutes([
	Route.get("/", require("./controllers/MainController/MainController.js"))
]).withoutDatabase().setSecurePort(4443).setCertificate({
	privateKey,
	certificate
}).init((port) => {
	request.get("https://localhost:" + WombatServer.securePort + "/", (error, response, body) => {
		if (!error){
			if (body === "OK"){
				process.exit(0);
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