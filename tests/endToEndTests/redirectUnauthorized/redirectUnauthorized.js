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
		let token = body;
		if (token.length > 0){
			let cookieJar = request.jar();
			cookieJar.setCookie(request.cookie("jwt=" + token), "http://localhost:"+WombatServer.getPort());
			request.get({
				url: "http://localhost:" + WombatServer.getPort() + "/userArea",
				jar: cookieJar
			}, (error, response, body) => {
				if (body === "AUTHORIZED"){
					finishTest();
				}
				else{
					throw new Error("The server didn't allowed authorized request.");
				}
			});
		}
		else{
			throw new Error("The server returned empty string instead of jwt, when tried to authenticate with right username and password.");
		}
	});
	request.get({
		url: "http://localhost:" + WombatServer.getPort() + "/userArea"
	}, (error, response, body) => {
		if (body === "UNAUTHORIZED"){
			finishTest();
		}
		else{
			throw new Error("The server didn't redirected unauthorized request.");
		}
	});
});