let AuthenticationSourceInterface = require("./AuthenticationSourceInterface.js");

class AuthenticationService{
	static setAuthenticationSource(AuthSource){
		if (!(AuthSource.prototype instanceof AuthenticationSourceInterface)){
			throw new Error("The provided authentication source is not implementing AuthenticationSourceInterface.");
		}
		this.authSource = AuthSource;
	}
	static authenticateUser(username, password){
		return this.authSource.authenticateUser(username, password);
	}
}

if (typeof AuthenticationService.authSource === "undefined"){
	AuthenticationService.setAuthenticationSource(require("./AuthenticationSources/DatabaseAuthenticationSource.js"));
}

module.exports = AuthenticationService;