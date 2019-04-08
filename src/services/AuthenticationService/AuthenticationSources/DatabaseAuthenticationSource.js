let AuthenticationSourceInterface = require("../AuthenticationSourceInterface.js"),
	CollectionsProvider = require("../../../CollectionsProvider.js");

class DatabaseAuthenticationSource extends AuthenticationSourceInterface{
	static authenticateUser(username, password){
		return new Promise((resolve, reject) => {
			let findParameters = {};
			findParameters[this.getIdentificationField()] = username;
			CollectionsProvider.collections[this.getAuthenticationCollection()].collection.findOne(findParameters, (error, user) => {
				if (!error){
					if (user){
						this.bcrypt.compare(password, user[this.getAuthenticationField()], (error, result) => {
							if (result){
								resolve(user);
							}
							else{
								resolve(null);
							}
						});
					}
					else{
						resolve(null);
					}
				}
				else{
					reject(error);
				}
			});
		});
	}
	static getAuthenticationCollection(){
		return this.collectionName;
	}
	static setAuthenticationCollection(collectionName){
		this.collectionName = collectionName;
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

if (typeof DatabaseAuthenticationSource.bcrypt === "undefined"){
	DatabaseAuthenticationSource.bcrypt = require("bcrypt");
}

if (typeof DatabaseAuthenticationSource.getAuthenticationCollection() === "undefined"){
	DatabaseAuthenticationSource.setAuthenticationCollection("users");
}

if (typeof DatabaseAuthenticationSource.getIdentificationField() === "undefined"){
	DatabaseAuthenticationSource.setIdentificationField("username");
}

if (typeof DatabaseAuthenticationSource.getAuthenticationField() === "undefined"){
	DatabaseAuthenticationSource.setAuthenticationField("password");
}

module.exports = DatabaseAuthenticationSource;