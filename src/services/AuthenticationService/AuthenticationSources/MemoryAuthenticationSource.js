let AuthenticationSourceInterface = require("../AuthenticationSourceInterface.js"),
	{ CollectionsProvider } = require("../../../../index.js");

class MemoryAuthenticationSource extends AuthenticationSourceInterface{
	static authenticateUser(username, password){
		return new Promise((resolve, reject) => {
			let user = this.getUsers().find((userRecord) => {
				return userRecord[this.getIdentificationField()] === username;
			});
			if (user){
				if (user[this.getAuthenticationField()] === password){
					resolve(user);
				}
				else{
					resolve(null);
				}
			}
			else{
				resolve(user);
			}
		});
	}
	static getUsers(){
		return this.users;
	}
	static setUsers(users){
		this.users = [];
		for (let userIndex in users){
			this.addUser(users[userIndex]);
		}
		return this;
	}
	static clearUsers(){
		this.setUsers([]);
		return this;
	}
	static addUser(user){
		if (typeof this.users === "undefined"){
			this.users = [];
		}
		if (typeof user[this.getIdentificationField()] === "undefined"){
			throw new Error("This user don't have the `" + this.getIdentificationField() + "` attribute.");
		}
		if (typeof user[this.getAuthenticationField()] === "undefined"){
			throw new Error("This user don't have the `" + this.getAuthenticationField() + "` attribute.");
		}
		if (this.getUsers().find(((existingUser) => {
			return existingUser[this.getIdentificationField()] === user[this.getIdentificationField()];
		}))){
			throw new Error("A user with the same `" + this.getIdentificationField() + "` attribute exists.");
		}
		this.users.push(user);
		return this;
	}
	static getIdentificationField(){
		return this.identificationField;
	}
	static setIdentificationField(identificationField){
		this.identificationField = identificationField;
		return this;
	}
	static getAuthenticationField(){
		return this.authenticationField;
	}
	static setAuthenticationField(authenticationField){
		this.authenticationField = authenticationField;
		return this;
	}
}

if (typeof MemoryAuthenticationSource.getUsers() === "undefined"){
	MemoryAuthenticationSource.setUsers([]);
}

if (typeof MemoryAuthenticationSource.getIdentificationField() === "undefined"){
	MemoryAuthenticationSource.setIdentificationField("username");
}

if (typeof MemoryAuthenticationSource.getAuthenticationField() === "undefined"){
	MemoryAuthenticationSource.setAuthenticationField("password");
}

module.exports = MemoryAuthenticationSource;