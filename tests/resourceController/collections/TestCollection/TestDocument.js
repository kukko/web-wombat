let { BaseDocument, fieldTypes } = require("../../../../index.js");

class TestDocument extends BaseDocument {
	static buildStructure() {
		this.addField(
			new fieldTypes.TextField(
				"name",
				"string",
				true,
				true
			).setPlaceholder("Name")
		);
	}
}

module.exports = TestDocument;
