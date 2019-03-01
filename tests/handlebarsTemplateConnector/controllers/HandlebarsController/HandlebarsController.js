let { BaseController } = require('../../../../index.js');

class HandlebarsController extends BaseController {
	existingView() {
		this.view('existing', {
			foo: 'bar'
		});
	}
	notExistingView() {
		this.view('not-existing', {
			foo: 'bar'
		}).catch((e) => {
			console.log(e);
			this.response.end();
		});
	}
}

module.exports = HandlebarsController;
