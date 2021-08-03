let { join, dirname } = require("path");

class DatabaseHolder {
	static getCollections() {
		if (typeof this.collections === "undefined") {
			this.collections = require("./CollectionsProvider.js").getCollections();
		}
		return this.collections;
	}
	static getCollectionCNT() {
		return Object.keys(this.getCollections()).length;
	}
	static connect(connectionString, database) {
		let dbConfig = require('./config/Config.js').GetDb();
		if (typeof connectionString === "undefined") {
			connectionString = this.buildConnectionString(dbConfig);
		}
		return new Promise((resolve, reject) => {
			require("mongodb").MongoClient.connect(
				connectionString,
				{
					useNewUrlParser: true,
					useUnifiedTopology: true
				},
				this.connectCallback(database, resolve, reject)
			);
		});
	}
	static buildConnectionString(dbConfig){
		if (dbConfig === undefined){
			dbConfig = require('./config/Config.js').GetDb();
		}
		let output = 
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
			output += "?authSource=" + dbConfig.authSource;
		}
		return output;
	}
	static connectCallback(database, resolve, reject){
		return (error, connection) => {
			if (!error) {
				let dbConfig = require('./config/Config.js').GetDb();
				this.dbConnection = connection;
				this.db = this.dbConnection.db(
					typeof database !== "undefined"
						? database
						: dbConfig.database
				);
				if (Object.keys(this.getCollections()).length > 0) {
					for (let collectionName in this.getCollections()) {
						this.getCollections()[collectionName]
							.create(this.db)
							.then((collection) => {
								this.collectionCreated(collection, resolve);
							});
					}
				} else {
					resolve(true);
				}
			} else {
				reject(error);
			}
		};
	}
	static collectionCreated(collection, resolve){
		this.createdCollections++;
		if (
			this.createdCollections >=
			this.getCollectionCNT()
		) {
			resolve(true);
		}
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
}

DatabaseHolder.createdCollections = 0;

module.exports = DatabaseHolder;
