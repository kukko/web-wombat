let QueryBuilderInterface = require("../QueryBuilderInterface.js"),
	CollectionsProvider = require("../../CollectionsProvider.js");

class MongoDBQueryBuilder extends QueryBuilderInterface {
	from(collectionName) {
		this.collection = CollectionsProvider.collections[collectionName];
		console.log(this.collection);
	}
	where(condition) {
		if (typeof this._where === "undefined") {
			this._where = [];
		}
		this._where.push(condition);
	}
	getWhere() {
		return typeof this._where !== "undefined" ? this._where : {};
	}
	insert(collectionName, toBeInserted) {}
}

module.exports = MongoDBQueryBuilder;
