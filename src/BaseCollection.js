let DatabaseHolder = require("./DatabaseHolder.js"),
	{ ObjectId } = require("mongodb");

class BaseCollection {
	static get collectionName() {
		throw new Error(
			"Not implemented 'collectionName' attribute getter method in class: " +
				this.name +
				"!"
		);
	}
	static set collection(collection) {
		this._collection = collection;
	}
	static get collection() {
		return typeof this._collection !== "undefined"
			? this._collection
			: null;
	}
	static create(db) {
		return new Promise((resolve, reject) => {
			if (typeof this._collection === "undefined") {
				this.connector
					.createCollection(db, this.collectionName)
					.then((collection) => {
						this.collection = collection;
						resolve(this.collection);
					});
			} else {
				reject(this._collection);
			}
		});
	}
	static runAfterCreate() {}
	static getDocumentById(id) {
		return this.connector.findById(this.collection, id);
	}
	static getDocument(conditions) {
		return this.connector.find(this.collection, conditions);
	}
	static createDocument(document) {
		return this.connector.insertOne(this.collection, document);
	}
	static createDocuments(document) {
		return this.connector.insert(this.collection, [document]);
	}
	static updateDocumentById(id, values) {
		return this.connector.updateById(this.collection, id, values);
	}
	static updateDocument(conditions, values) {
		return this.connector.update(this.collection, values, conditions);
	}
	static deleteDocument(conditions) {
		return this.connector.delete(this.collection, conditions);
	}
	static deleteDocumentById(id) {
		return this.connector.deleteById(this.collection, id);
	}
	static get connector() {
		return DatabaseHolder.getDatabaseConnector();
	}
}

module.exports = BaseCollection;
