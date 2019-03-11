let { WombatServer } = require("../../index.js");

WombatServer.setUnsecure().init(port => {
	require("http")
		.get("http://localhost:" + port + "/test", response => {
			if (response.statusCode !== 200) {
				throw new Error("Request returned other code than 200.");
			}
			let data = "";
			response.on("data", chunk => {
				data += chunk;
			});
			response.on("end", () => {
				console.log("Response: " + data);
				process.exit();
			});
		})
		.on("error", error => {
			console.log(error);
			process.exit(1);
		});
});
