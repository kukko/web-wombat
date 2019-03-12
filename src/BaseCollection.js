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
}

module.exports = BaseCollection;
