class AuthenticationSourceInterface{
	static authenticateUser(username, password){
		throw new Error("You must implement the `authenticateUser` method in your AuthenticationSource.");
	}
}

module.exports = AuthenticationSourceInterface;