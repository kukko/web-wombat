let { WombatServer } = require("../../index.js");

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
			(response) => {
				if (response.statusCode !== 200) {
					throw new Error("Request returned other code than 200.");
				}
				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});
				response.on("end", () => {
					console.log("Existing asset request finished!");
					finishTest();
				});
			}
		).on("error", (error) => {
			console.log(error);
			process.exit(1);
		});
		http.get(
			"http://localhost:" + port + "/resources/assets/images/missing.jpg",
			(response) => {
				if (response.statusCode !== 404) {
					throw new Error("Request returned other code than 404.");
				}
				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});
				response.on("end", () => {
					console.log("Missing asset request finished!");
					finishTest();
				});
			}
		).on("error", (error) => {
			console.log(error);
			process.exit(1);
		});
	});
