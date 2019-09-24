let { WombatServer, AuthenticationService, authenticationSources } = require("../../../index.js"),
	request = require("request");

if (authenticationSources.MemoryAuthenticationSource.getUsers().constructor.name !== "Array"){
	throw new Array("the getUsers method not returned array.");
}

if (authenticationSources.MemoryAuthenticationSource.getUsers().length !== 0){
	throw new Error("The getUsers method's return value wasn't empty.");
}

authenticationSources.MemoryAuthenticationSource.setUsers([
	{
		username: "bar",
		password: "foo"
	}
]);

if (authenticationSources.MemoryAuthenticationSource.getUsers().length !== 1){
	throw new Error("The getUsers method's return value didn't have one element.");
}

authenticationSources.MemoryAuthenticationSource.addUser({
	username: "foo",
	password: "bar"
});

if (authenticationSources.MemoryAuthenticationSource.getUsers().length !== 2){
	throw new Error("The getUsers method's return value didn't have two element.");
}

try{
	authenticationSources.MemoryAuthenticationSource.addUser({
		username: "foo",
		password: "bar"
	});
	throw new Error("The authentication source didn't throw an error when tried to add a user with a username which is already exists.");
}
catch (e){
	// The authentication source throwed an error, because a user with the same username have been already added.
}

AuthenticationService.setAuthenticationSource(authenticationSources.MemoryAuthenticationSource);

let completedTests = 0,
	finishTest = () => {
		completedTests++;
		if (completedTests === 2){
			process.exit(0);
		}
	};

WombatServer.withoutDatabase().setUnsecure().init(() => {
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
		if (body.length === 0){
			console.log("Wrong auhentication test finished!");
			finishTest();
		}
		else{
			throw new Error("The server not returned null when tried to authenticate with wrong username and password.");
		}
	});
});