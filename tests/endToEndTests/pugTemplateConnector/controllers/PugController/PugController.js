let { BaseController } = require("../../../../../index.js");

class PugController extends BaseController {
	existingView() {
		this.view("existing", {
			foo: this.request.body.foo
		});
	}
	notExistingView() {
		this.view("not-existing", {
			foo: "bar"
		}).catch((e) => {
			this.response.end("VIEW ERROR!");
		});
	}
}

module.exports = PugController;
