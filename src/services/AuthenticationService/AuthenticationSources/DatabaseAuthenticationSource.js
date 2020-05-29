let AuthenticationSourceInterface = require("../AuthenticationSourceInterface.js"),
	CollectionsProvider = require("../../../CollectionsProvider.js");

class DatabaseAuthenticationSource extends AuthenticationSourceInterface{
	static authenticateUser(username, password){
		return new Promise((resolve, reject) => {
			let findParameters = {};
			findParameters[this.getIdentificationField()] = username;
			CollectionsProvider.getCollection(this.getAuthenticationCollection()).findOne(findParameters, (error, user) => {
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
	static addUser(user){
		return new Promise((resolve, reject) => {
			let findParameters = {};
			findParameters[this.getIdentificationField()] = user[this.getIdentificationField()];
			CollectionsProvider.getCollection(this.getAuthenticationCollection()).findOne(findParameters, (findError, foundUser) => {
				if (!findError){
					if (!foundUser){
						this.hashPassword(user[this.getAuthenticationField()]).then((hash) => {
							user[this.getAuthenticationField()] = hash;
							CollectionsProvider.getCollection(this.getAuthenticationCollection()).insertOne(user, (insertError, result) => {
								if (!insertError){
									resolve(true);
								}
								else{
									reject(insertError);
								}
							});
						}).catch((hashingError) => {
							reject(hashingError);
						});
					}
					else{
						reject(new Error("The username is already in use."));
					}
				}
				else{
					reject(findError);
				}
			});
		});
	}
	static hashPassword(password){
		return new Promise((resolve, reject) => {
			this.bcrypt.hash(password, 10, (hashingError, hash) => {
				if (!hashingError){
					resolve(hash);
				}
				else{
					reject(hashingError);
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

DatabaseAuthenticationSource.bcrypt = require("bcrypt");
DatabaseAuthenticationSource.setAuthenticationCollection("users");
DatabaseAuthenticationSource.setIdentificationField("username");
DatabaseAuthenticationSource.setAuthenticationField("password");

module.exports = DatabaseAuthenticationSource;