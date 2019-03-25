let { BaseCollection, DatabaseHolder } = require("../../../../index.js");

class TestCollection extends BaseCollection {
	static get collectionName() {
		return "test";
	}
}

module.exports = TestCollection;
