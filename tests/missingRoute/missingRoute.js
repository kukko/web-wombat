let { WombatServer } = require("../../index.js");
WombatServer.withoutDatabase()
	.setUnsecure()
	.setRoutes([])
	.init((port) => {
		require("http")
			.get("http://localhost:" + port, (response) => {
				if (response.statusCode !== 404) {
					throw new Error("Request returned other code than 404.");
				}
				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});
				response.on("end", () => {
					console.log("Response: " + data);
					process.exit();
				});
			})
			.on("error", (error) => {
				console.log(error);
				process.exit(1);
			});
	});
