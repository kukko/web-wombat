let { WombatServer, Route } = require("../../../index.js"),
	logger = require("../../../src/Logger.js");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
WombatServer.withoutDatabase()
	.setRoutes([
		Route.get(
			"/secure",
			require("./controllers/SecurityTestController/SecurityTestController.js"),
			"secure"
		),
		Route.get(
			"/unsecure",
			require("./controllers/SecurityTestController/SecurityTestController.js"),
			"unsecure"
		)
	])
	.setSecurePort(4443)
	.setHttpsOptions({
		rejectUnauthorized: false
	})
	.init((port) => {
		new Promise((resolve, reject) => {
			let finished = 0,
				finish = () => {
					finished++;
					if (finished === 2) {
						process.exit();
					}
				};
			require("http")
				.get("http://localhost:" + port + "/unsecure",
				{
					headers: {
						"content-type": "text/html"
					}
				}, (response) => {
					if (response.statusCode === 200) {
						logger.log("Unsecure connection test completed!");
						finish();
					} else {
						throw new Error("Can't establish unsecure connection!");
					}
				})
				.on("error", (error) => {
					logger.log(error);
					process.exit(1);
				});
			require("https")
				.get("https://localhost:" + WombatServer.getSecurePort() + "/secure",
				{
					headers: {
						"content-type": "text/html"
					}
				}, (response) => {
					if (response.statusCode === 200) {
						logger.log("Secure connection test completed!");
						finish();
					} else {
						throw new Error("Can't establish secure connection!");
					}
				})
				.on("error", (error) => {
					logger.log(error);
					process.exit(1);
				});
		});
	});
