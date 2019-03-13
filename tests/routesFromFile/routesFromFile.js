let { WombatServer } = require("../../index.js"),
	logger = require('../../src/Logger.js');

WombatServer.withoutDatabase()
	.setUnsecure()
	.init((port) => {
		require("http")
			.get("http://localhost:" + port, (response) => {
				if (response.statusCode !== 200) {
					throw new Error("Request returned other code than 200.");
				}
				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});
				response.on("end", () => {
					if (data === "Foo!") {
						logger.log("Request from file test completed!");
						process.exit();
					} else {
						throw new Error("Request returned wrong response.");
					}
				});
			})
			.on("error", (error) => {
				logger.log(error);
				process.exit(1);
			});
	});
