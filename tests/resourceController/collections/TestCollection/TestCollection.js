let { BaseCollection } = require("../../../../index.js"),
	TestDocument = require('./TestDocument.js');

class TestCollection extends BaseCollection {
	static get collectionName() {
		return "test";
	}
	static getDocument(){
		return TestDocument;
	}
}

module.exports = TestCollection;
