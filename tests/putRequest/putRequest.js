let { WombatServer, Route } = require("../../index.js");
WombatServer.withoutDatabase()
	.setUnsecure()
	.setRoutes([
		Route.put(
			"/",
			require("./controllers/PutRequestController/PutRequestController.js")
		)
	])
	.init((port) => {
		let request = require("http").request(
			{
				host: "localhost",
				port: port,
				path: "/",
				method: "PUT"
			},
			(response) => {
				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});
				response.on("end", () => {
					if (data === "<h1>" + sentString + "</h1>") {
						console.log("Put request test completed!");
					} else {
						throw new Error(
							"Received response is not containing the sent string!"
						);
					}
					process.exit();
				});
			}
		);
		request.on("error", (error) => {
			process.exit();
		});
		let sentString = "";
		for (let i = 0; i < 8; i++) {
			let chars =
				"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			sentString += chars.charAt(
				Math.floor(Math.random() * chars.length)
			);
		}
		request.write("foo=" + sentString);
		request.end();
	});
