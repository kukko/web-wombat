class FormBuilder {
	static formMethodInput(method) {
		return (
			"<input type='hidden' name='_form_method' value='" + method + "'>"
		);
	}
}

module.exports = FormBuilder;
