let DatabaseInterface = require("../DatabaseInterface.js"),
	{ ObjectId } = require("mongodb");

class MongoDBConnector extends DatabaseInterface {
	static getDefaultIdField() {
		return "_id";
	}
	static connect(dbConfig) {
		return new Promise((resolve, reject) => {
			let connectionString =
				"mongodb://" +
				this.getAuthentication(dbConfig.username, dbConfig.password) +
				dbConfig.host +
				":" +
				dbConfig.port +
				"/";
			if (
				typeof dbConfig.authSource !== "undefined" &&
				dbConfig.authSource.length > 0
			) {
				connectionString += "?authSource=" + dbConfig.authSource;
			}
			this.mongodb.MongoClient.connect(
				connectionString,
				{
					useNewUrlParser: true
				},
				(error, connection) => {
					if (error) {
						reject(error);
					} else {
						resolve(connection);
					}
				}
			);
		});
	}
	static getAuthentication(username, password) {
		if (
			typeof username !== "undefined" &&
			username.length > 0 &&
			typeof password !== "undefined" &&
			password.length > 0
		) {
			return username + ":" + password + "@";
		}
		return "";
	}
	static createCollection(db, collectionName) {
		return new Promise((resolve, reject) => {
			db.createCollection(collectionName, (error, collection) => {
				if (!error) {
					resolve(collection);
				} else {
					reject(error);
				}
			});
		});
	}
	static insert(collection, toBeInserted) {
		return new Promise((resolve, reject) => {
			collection.insertMany(toBeInserted, (error, result) => {
				if (!error) {
					this.addGetId(result.ops, true);
					resolve(result.ops);
				} else {
					reject(error);
				}
			});
		});
	}
	static insertOne(collection, toBeInserted) {
		return new Promise((resolve, reject) => {
			this.insert(collection, [toBeInserted])
				.then((result) => {
					if (result.length > 0) {
						resolve(result[0]);
					}
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
	static find(collection, conditions) {
		return new Promise((resolve, reject) => {
			collection.find(conditions, (error, result) => {
				if (!error) {
					result.toArray().then((arrayResult) => {
						resolve(arrayResult);
					});
				} else {
					reject(error);
				}
			});
		});
	}
	static findOne(collection, conditions) {
		return new Promise((resolve, reject) => {
			collection.findOne(conditions, (error, result) => {
				if (!error) {
					resolve(result);
				} else {
					reject(error);
				}
			});
		});
	}
	static findById(collection, id) {
		let conditions = {};
		conditions[this.getDefaultIdField()] =
			id instanceof ObjectId ? id : new ObjectId(id);
		return this.findOne(collection, conditions);
	}
	static update(collection, data, conditions) {
		return new Promise((resolve, reject) => {
			collection.updateOne(
				conditions,
				{
					$set: data
				},
				(error, result) => {
					if (!error) {
						resolve(result);
					} else {
						reject(error);
					}
				}
			);
		});
	}
	static updateById(collection, id, data) {
		return new Promise((resolve, reject) => {
			let conditions = {};
			conditions[this.getDefaultIdField()] =
				id instanceof ObjectId ? id : new ObjectId(id);
			collection.updateOne(
				conditions,
				{
					$set: data
				},
				(error, result) => {
					if (!error) {
						resolve(result.matchedCount);
					} else {
						reject(error);
					}
				}
			);
		});
	}
	static delete(collection, conditions) {
		return new Promise((resolve, reject) => {
			let conditions = {};
			conditions[this.getDefaultIdField()] =
				id instanceof ObjectId ? id : new ObjectId(id);
			collection.delete(conditions, (error, result) => {
				if (!error) {
					resolve(result.deletedCount);
				} else {
					reject(error);
				}
			});
		});
	}
	static deleteById(collection, id) {
		return new Promise((resolve, reject) => {
			let conditions = {};
			conditions[this.getDefaultIdField()] =
				id instanceof ObjectId ? id : new ObjectId(id);
			collection.deleteOne(conditions, (error, result) => {
				if (!error) {
					resolve(result.deletedCount);
				} else {
					reject(error);
				}
			});
		});
	}
}

if (typeof MongoDBConnector.mongodb === "undefined") {
	MongoDBConnector.mongodb = require("mongodb");
}

module.exports = MongoDBConnector;
