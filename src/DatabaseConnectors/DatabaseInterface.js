class DatabaseInterface {
	static getDefaultIdField() {
		throw new Error(
			"You must implement the `getDefaultIdField` method in your DatabaseConnector."
		);
	}
	static connect(dbConfig) {
		throw new Error(
			"You must implement the `connect` method in your DatabaseConnector."
		);
	}
	static createCollection(db, collectionName) {}
	static insertOne(toBeInserted) {
		throw new Error(
			"You must implement the `insertOne` method in your DatabaseConnector."
		);
	}
	static insert(toBeInserted) {
		throw new Error(
			"You must implement the `insert` method in your DatabaseConnector."
		);
	}
	static find(conditions) {
		throw new Error(
			"You must implement the `find` method in your DatabaseConnector."
		);
	}
	static findOne(conditions) {
		throw new Error(
			"You must implement the `findOne` method in your DatabaseConnector."
		);
	}
	static findById(id) {
		throw new Error(
			"You must implement the `findById` method in your DatabaseConnector."
		);
	}
	static update(data, conditions) {
		throw new Error(
			"You must implement the `update` method in your DatabaseConnector."
		);
	}
	static updateById(data, id) {
		throw new Error(
			"You must implement the `updateById` method in your DatabaseConnector."
		);
	}
	static delete(conditions) {
		throw new Error(
			"You must implement the `updateById` method in your DatabaseConnector."
		);
	}
	static deleteById(id) {
		throw new Error(
			"You must implement the `deleteById` method in your DatabaseConnector."
		);
	}
	static addGetId(input, array = false) {
		if (!array) {
			input.getId = () => {
				return input[this.getDefaultIdField()];
			};
		} else {
			input.forEach((item, index) => {
				this.addGetId(item);
			});
		}
	}
}

module.exports = DatabaseInterface;
