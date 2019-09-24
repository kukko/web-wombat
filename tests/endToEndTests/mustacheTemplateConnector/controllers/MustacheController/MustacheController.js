let { BaseController } = require("../../../../../index.js");

class MustacheController extends BaseController {
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

module.exports = MustacheController;
