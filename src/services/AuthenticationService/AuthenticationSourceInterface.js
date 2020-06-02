class AuthenticationSourceInterface{
	static authenticateUser(username, password){
		throw new Error("You must implement the `authenticateUser` method in your AuthenticationSource.");
	}
	static addUser(user){
		throw new Error("You must implement the `addUser` method in your AuthenticationSource.");
	}
	static buildUserObject(username, password){
		throw new Error("You must implement the `buildUserObject` method in your AuthenticationSource.");
	}
}

module.exports = AuthenticationSourceInterface;