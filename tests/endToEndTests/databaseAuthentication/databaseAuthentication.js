let { WombatServer, AuthenticationService, authenticationSources } = require("../../../index.js"),
	request = require("request");

AuthenticationService.setAuthenticationSource(authenticationSources.DatabaseAuthenticationSource);

let completedTests = 0,
	finishTest = () => {
		completedTests++;
		if (completedTests === 2){
			process.exit(0);
		}
	};

WombatServer.setUnsecure().init(() => {
	request.post({
		url: "http://localhost:" + WombatServer.getPort() + "/login",
		form: {
			username: "foo",
			password: "bar"
		}
	}, (error, response, body) => {
		let user = JSON.parse(body);
		if (user !== null){
			console.log("Successful auhentication test finished!");
			finishTest();
		}
		else{
			throw new Error("The server returned null instead of user, when tried to authenticate with right username and password.");
		}
	});
	request.post({
		url: "http://localhost:" + WombatServer.getPort() + "/login",
		form: {
			username: "wrongUsername",
			password: "wrongPassword"
		}
	}, (error, response, body) => {
		body = JSON.parse(body);
		if (body === null){
			console.log("Wrong auhentication test finished!");
			finishTest();
		}
		else{
			throw new Error("The server not returned null when tried to authenticate with wrong username and password.");
		}
	});
});