let { ObjectId } = require("mongodb");

class BaseCollection {
	static get collectionName() {
		throw new Error(
			"Not implemented 'collectionName' attribute getter method in class: " +
				this.name +
				"!"
		);
	}
	static get collection() {
		return typeof this._collection !== "undefined"
			? this._collection
			: null;
	}
	static create(db) {
		return new Promise((resolve, reject) => {
			if (typeof this._collection === "undefined") {
				db.createCollection(
					this.collectionName,
					(error, collection) => {
						if (!error) {
							this._collection = collection;
							this.runAfterCreate().then((result) => {
								resolve(this.collection);
							});
						} else {
							if (error.code === 48){
								this._collection = db.collection(this.collectionName);
								resolve(this.collection);
							}
							else{
								reject(error);
							}
						}
					}
				);
			} else {
				resolve(this._collection);
			}
		});
	}
	static runAfterCreate() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	static getDocument() {}
	static createDocument(document) {
		return new Promise((resolve, reject) => {
			this.collection
				.insertOne(document)
				.then((document) => {
					resolve(document.insertedId);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
	static updateDocument(id, values) {
		let structure = this.getDocument().getStructure(),
			newValues = {};
		for (let fieldIndex in structure) {
			let field = structure[fieldIndex];
			if (typeof values[field.name] !== "undefined") {
				newValues[field.name] = values[field.name];
			}
		}
		this.collection.updateOne(
			{
				_id: new ObjectId(id)
			},
			{
				$set: newValues
			}
		);
	}
	static deleteDocument(id) {
		return new Promise((resolve, reject) => {
			this.collection.deleteOne(
				{
					_id: new ObjectId(id)
				},
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result.result.ok === 1);
				}
			);
		});
	}
}

module.exports = BaseCollection;
