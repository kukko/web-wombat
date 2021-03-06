let AuthenticationSourceInterface = require("../AuthenticationSourceInterface.js"),
	CollectionsProvider = require("../../../CollectionsProvider.js");

class DatabaseAuthenticationSource extends AuthenticationSourceInterface{
	static authenticateUser(username, password){
		return new Promise((resolve, reject) => {
			this.getUser(username).then((user) => {
				if (user !== null){
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
			}).catch((error) => {
				reject(error);
			});
		});
	}
	static addUser(user){
		return new Promise((resolve, reject) => {
			let findParameters = {};
			findParameters[this.getIdentificationField()] = user[this.getIdentificationField()];
			this.getUser(user[this.getIdentificationField()]).then((foundUser) => {
				if (foundUser === null){
					this.hashPassword(user[this.getAuthenticationField()]).then((hash) => {
						user[this.getAuthenticationField()] = hash;
						CollectionsProvider.getCollection(this.getAuthenticationCollection()).collection.insertOne(user, (insertError, result) => {
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
			}).catch((findError) => {
				reject(findError);
			});
		});
	}
	static buildUserObject(username, password){
		let output = {};
		output[this.getIdentificationField()] = username;
		output[this.getAuthenticationField()] = password;
		return output;
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
	static getUser(username){
		let findParameters = {};
		findParameters[this.getIdentificationField()] = username;
		return CollectionsProvider.getCollection(this.getAuthenticationCollection()).collection.findOne(findParameters);
	}
	static changePassword(username, password){
		return new Promise((resolve, reject) => {
			this.getUser(username).then((user) => {
				let updateFields = {};
				this.hashPassword(password).then((hash) => {
					updateFields[this.getAuthenticationField()] = hash;
					CollectionsProvider.getCollection(this.getAuthenticationCollection()).collection.updateOne({
						_id: user._id
					}, {
						$set: updateFields
					}).then(() => {
						resolve(true);
					}).catch((e) => {
						reject(e);
					});
				}).catch((e) => {
					reject(e);
				});
			}).catch((e) => {
				reject(e);
			});
		});
	}
}

DatabaseAuthenticationSource.bcrypt = require("bcrypt");
DatabaseAuthenticationSource.setAuthenticationCollection("users");
DatabaseAuthenticationSource.setIdentificationField("username");
DatabaseAuthenticationSource.setAuthenticationField("password");

module.exports = DatabaseAuthenticationSource;