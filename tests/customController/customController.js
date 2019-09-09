let { WombatServer } = require("../../index.js"),
	request = require("request");

let completedTests = 0,
	finishTest = () => {
		completedTests++;
		if (completedTests === 1){
			process.exit(0);
		}
	};

WombatServer.withoutDatabase().setUnsecure().init(() => {
	request.get({
		url: "http://localhost:" + WombatServer.getPort() + "/"
	}, (error, response, body) => {
		if (body === "OK"){
			console.log("Request finished successfully!");
			finishTest();
		}
		else{
			throw new Error("The server returned null.");
		}
	});
});