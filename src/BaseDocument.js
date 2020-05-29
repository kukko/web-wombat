class BaseDocument {
	static getStructure(values) {
		if (typeof this.structure === "undefined") {
			this.createStructure();
		}
		if (typeof values !== "undefined") {
			let output = [];
			for (let i in this.structure) {
				output.push(
					Object.assign(
						new this.structure[i].constructor(),
						this.structure[i]
					)
				);
			}
			for (let fieldName in values) {
				let field = this.getFieldByName(fieldName, output);
				if (
					typeof field !== "undefined" &&
					typeof values[fieldName] !== "undefined"
				) {
					field.setValue(values[fieldName]);
				}
			}
			return output;
		}
		return this.structure;
	}
	static createStructure() {
		this.structure = [];
		this.buildStructure();
	}
	static buildStructure() {}
	static addField(field) {
		if (typeof this.structure === "undefined"){
			this.createStructure();
		}
		this.structure.push(field);
		return this;
	}
	static getFieldByName(name, fields) {
		if (typeof fields === "undefined") {
			fields = this.structure;
		}
		for (let i in fields) {
			if (fields[i].name === name) {
				return fields[i];
			}
		}
	}
	static validateDocument(values) {
		let fields = this.getStructure(values),
			output = true;
		for (let fieldIndex in fields) {
			output = output && fields[fieldIndex].validate();
			if (!output) {
				break;
			}
		}
		return output;
	}
}

module.exports = BaseDocument;
