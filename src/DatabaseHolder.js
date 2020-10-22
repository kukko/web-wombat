let { join, dirname } = require("path");

class DatabaseHolder {
	static get collections() {
		if (typeof this._collections === "undefined") {
			this._collections = require("./CollectionsProvider.js").getCollections();
		}
		return this._collections;
	}
	static get collectionCNT() {
		return Object.keys(this.collections).length;
	}
	static connect(connectionString, database) {
		let dbConfig = require(join(
			dirname(require.main.filename),
			"/config/db.js"
		));
		if (typeof connectionString === "undefined") {
			connectionString =
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
		}
		let createdCollections = 0,
			failedCollectionCreation = 0;
		return new Promise((resolve, reject) => {
			require("mongodb").MongoClient.connect(
				connectionString,
				{
					useNewUrlParser: true,
					useUnifiedTopology: true
				},
				(error, connection) => {
					if (!error) {
						this.dbConnection = connection;
						this.db = this.dbConnection.db(
							typeof database !== "undefined"
								? database
								: dbConfig.database
						);
						let collectionCreated = (collection) => {
							createdCollections++;
							if (
								createdCollections + failedCollectionCreation >=
								this.collectionCNT
							) {
								resolve(true);
							}
						};
						if (Object.keys(this.getCollections()).length > 0) {
							for (let collectionName in this.collections) {
								this.collections[collectionName]
									.create(this.db)
									.then(collectionCreated);
							}
						} else {
							resolve(true);
						}
					} else {
						reject(error);
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
}

module.exports = DatabaseHolder;
