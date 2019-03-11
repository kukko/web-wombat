class BaseField {
	constructor(name, type, showable, required) {
		this.setName(name);
		this.setType(type);
		this.setShowable(showable);
		this.setRequired(required);
	}
	setName(name) {
		this._name = name;
		return this;
	}
	get name() {
		return this._name;
	}
	setType(type) {
		this._type = type;
		return this;
	}
	setShowable(showable = false) {
		this._showable = showable;
		return this;
	}
	get showable(){
		return this._showable;
	}
	setRequired(required = true) {
		this._required = required;
		return this;
	}
	setValue(value) {
		this._value = value;
		return this;
	}
	get value(){
		if (this.showable){
			return this._value;
		}
	}
	setLabel(label){
		this._label = label;
	}
	get label(){
		return typeof this._label !== 'undefined' ? this._label : this.name;
	}
	toString(){
		return this.label + ': ' + this.value;
	}
}

module.exports = BaseField;
