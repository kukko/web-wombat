let { WombatServer, Route, templateConnectors } = require("../../../index.js"),
	logger = require("../../../src/Logger.js");

WombatServer.withoutDatabase()
	.setRoutes([
		Route.post(
			"/existingView",
			require("./controllers/MustacheController/MustacheController.js"),
			"existingView"
		),
		Route.get(
			"/notExistingView",
			require("./controllers/MustacheController/MustacheController.js"),
			"notExistingView"
		)
	])
	.setTemplateConnector(templateConnectors.MustacheConnector)
	.setUnsecure()
	.init((port) => {
		let totalRequests = 2,
			completedRequests = 0,
			completeRequest = () => {
				completedRequests++;
				if (completedRequests === totalRequests) {
					process.exit();
				}
			},
			sentString = "";
		for (let i = 0; i < 8; i++) {
			let chars =
				"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			sentString += chars.charAt(
				Math.floor(Math.random() * chars.length)
			);
		}
		let request = require("http")
			.request(
				{
					host: "localhost",
					port,
					path: "/existingView",
					method: "POST"
				},
				(response) => {
					let data = "";
					response.on("data", (chunk) => {
						data += chunk;
					});
					response.on("end", () => {
						if (data === "<h1>" + sentString + "</h1>") {
							logger.log("Existing view test completed!");
						} else {
							throw new Error(
								"Received response is not containing the sent string!"
							);
						}
						completeRequest();
					});
				}
			)
			.on("error", (error) => {
				logger.log(error);
				process.exit(1);
			});
		request.write("foo=" + sentString);
		request.end();
		require("http")
			.get(
				"http://localhost:" + port + "/notExistingView",
				(response) => {
					if (response.statusCode !== 200) {
						throw new Error("Not existing route!");
					}
					let data = "";
					response.on("data", (chunk) => {
						data += chunk;
					});
					response.on("end", () => {
						if (data === "VIEW ERROR!") {
							logger.log("Not existing view test completed!");
						} else {
							throw new Error(
								"Not existing view request returned with wrong response!"
							);
						}
						completeRequest();
					});
				}
			)
			.on("error", (error) => {
				logger.log(error);
				process.exit(1);
			});
	});
