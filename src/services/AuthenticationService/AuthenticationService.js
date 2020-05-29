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
	static addUser(user){
		return this.authSource.addUser(user);
	}
}

AuthenticationService.setAuthenticationSource(require("./AuthenticationSources/DatabaseAuthenticationSource.js"));

module.exports = AuthenticationService;