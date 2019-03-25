let DatabaseInterface = require("./DatabaseConnectors/DatabaseInterface.js"),
	{ join, dirname } = require("path");

class DatabaseHolder {
	static get collections() {
		if (typeof this._collections === "undefined") {
			this._collections = require("./CollectionsProvider.js").collections;
		}
		return this._collections;
	}
	static get collectionCNT() {
		return Object.keys(this.collections).length;
	}
	static connect(connectionString, database) {
		return new Promise((resolve, reject) => {
			let dbConfig = require(join(
				dirname(require.main.filename),
				"/config/db.js"
			));
			let createdCollections = 0,
				failedCollectionCreation = 0;
			this.getDatabaseConnector()
				.connect(dbConfig)
				.then((connection) => {
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
					if (Object.keys(this.collections).length > 0) {
						for (let collectionName in this.collections) {
							this.collections[collectionName]
								.create(this.db)
								.then(collectionCreated);
						}
					} else {
						resolve(true);
					}
				});
		});
	}
	static setDatabaseConnector(Connector) {
		let connectorObj = new Connector();
		if (!(new Connector() instanceof DatabaseInterface)) {
			throw new Error(
				"The " +
					connectorObj.constructor.name +
					" is not extending the DatabaseInterface class."
			);
		}
		this.connector = Connector;
	}
	static getDatabaseConnector() {
		return this.connector;
	}
	static getConnection() {
		return this.dbConnection;
	}
}

module.exports = DatabaseHolder;

DatabaseHolder.connector = require("./DatabaseConnectors/MongoDBConnector/MongoDBConnector.js");
