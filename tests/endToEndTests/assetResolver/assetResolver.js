let { WombatServer } = require("../../../index.js"),
	logger = require("../../../src/Logger.js");

WombatServer.withoutDatabase()
	.setUnsecure()
	.setRoutes([])
	.init((port) => {
		let http = require("http"),
			runnedTests = 0,
			finishTest = () => {
				runnedTests++;
				if (runnedTests === 2) {
					process.exit();
				}
			};
		http.get(
			"http://localhost:" + port + "/resources/assets/images/wombat.jpg",
			{
				headers: {
					"content-type": "text/html"
				}
			},
			(response) => {
				if (response.statusCode !== 200) {
					throw new Error("Request returned other code than 200.");
				}
				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});
				response.on("end", () => {
					logger.log("Existing asset request finished!");
					finishTest();
				});
			}
		).on("error", (error) => {
			logger.log(error);
			process.exit(1);
		});
		http.get(
			"http://localhost:" + port + "/resources/assets/images/missing.jpg",
			{
				headers: {
					"content-type": "text/html"
				}
			},
			(response) => {
				if (response.statusCode !== 404) {
					throw new Error("Request returned other code than 404.");
				}
				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});
				response.on("end", () => {
					logger.log("Missing asset request finished!");
					finishTest();
				});
			}
		).on("error", (error) => {
			logger.log(error);
			process.exit(1);
		});
	});
