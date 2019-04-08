let { BaseCollection } = require("../../../../index.js");

class UsersCollection extends BaseCollection{
	static get collectionName(){
		return 'users';
	}
	static runAfterCreate() {
		return new Promise((resolve, reject) => {
			this.collection.deleteMany({}, (error, deleteResult) => {
				if (!error){
					require("bcrypt").hash("bar", 10, (error, hash) => {
						this.collection.insertOne({
							username: "foo",
							password: hash
						}, (error, insertResult) => {
							resolve();
						});
					});
				}
				else{
					reject(error);
				}
			});
		});
	}
}

module.exports = UsersCollection;