class BaseField {
	constructor(name, type, showable, editable, required) {
		this.setName(name);
		this.setType(type);
		this.setShowable(showable);
		this.setEditable(editable);
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
	get type() {
		return this._type;
	}
	setShowable(showable = false) {
		this._showable = showable;
		return this;
	}
	get showable() {
		return this._showable;
	}
	setEditable(editable = false) {
		this._editable = editable;
		return this;
	}
	get editable() {
		return this._editable;
	}
	setRequired(required = true) {
		this._required = required;
		return this;
	}
	get required() {
		return this._required;
	}
	setValue(value) {
		this._value = value;
		return this;
	}
	get value() {
		if (this.showable) {
			return typeof this._value !== "undefined" ? this._value : "";
		}
	}
	setLabel(label) {
		this._label = label;
	}
	getLabel() {
		return this._label;
	}
	get label() {
		return typeof this.getLabel() !== "undefined"
			? this.getLabel()
			: this.name;
	}
	validate() {
		return (
			typeof this.value === this.type &&
			(!this.required ||
				(this.required &&
					typeof this.value !== "undefined" &&
					this.value !== ""))
		);
	}
	toString() {
		return this.label + ": " + this.value;
	}
}

module.exports = BaseField;
