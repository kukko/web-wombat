let BaseField = require("../BaseField.js");

class TextField extends BaseField {
	setPlaceholder(placeholder) {
		this._placeholder = placeholder;
		return this;
	}
	get placeholder() {
		return typeof this._placeholder !== "undefined"
			? this._placeholder
			: this.name;
	}
	toString(editable) {
		if (editable) {
			return (
				'<input type="text" name="' +
				this.name +
				'" placeholder="' +
				this.placeholder +
				'" value="' +
				this.value +
				'">'
			);
		}
		return super.toString();
	}
}

module.exports = TextField;
