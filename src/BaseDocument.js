class BaseDocument {
	static getStructure(values) {
		if (typeof this.structure === 'undefined'){
			this.createStructure();
		}
		if (typeof values !== 'undefined'){
			for (let fieldName in values){
				let field = this.getFieldByName(fieldName);
				if (typeof field !== 'undefined' && typeof values[fieldName] !== 'undefined'){
					field.setValue(values[fieldName]);
				}
			}
		}
		return this.structure;
	}
	static createStructure() {
		this.structure = [];
		this.buildStructure();
	}
	static buildStructure(){
	}
	static addField(field) {
		this.structure.push(field);
		return this;
	}
	static getFieldByName(name){
		for (let i in this.structure){
			if (this.structure[i].name === name){
				return this.structure[i];
			}
		}
	}
	static validateDocument(values){
		let fields = this.getStructure(values),
			output = true;
		for (let fieldIndex in fields){
			output = output && fields[fieldIndex].validate();
			if (!output){
				break;
			}
		}
		return output;
	}
}

module.exports = BaseDocument;
