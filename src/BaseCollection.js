let { ObjectId } = require("mongodb");

class BaseCollection {
	static get name() {
		throw new Error(
			"Not implemented 'name' attribute getter method in class: " +
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
							resolve(this.collection);
						} else {
							reject(error);
						}
					}
				);
			} else {
				resolve(this._collection);
			}
		});
	}
	static runAfterCreate() {}
	static getDocument() {}
	static updateDocument(id, values) {
		let structure = this.getDocument().getStructure(),
			newValues = {};
		for (let fieldIndex in structure){
			let field = structure[fieldIndex];
			if (typeof values[field.name] !== 'undefined'){
				newValues[field.name] = values[field.name];
			}
		}
		this.collection.updateOne({
			_id: ObjectId(id)
		}, {
			$set:newValues
		});
	}
	static deleteDocument(id){
		return new Promise((resolve, reject) => {
			this.collection.deleteOne({
				_id: ObjectId(id)
			}, (error, result) => {
				if (error){
					reject(error);
				}
				resolve(result.result.ok === 1);
			});
		});
	}
}

module.exports = BaseCollection;
