let { BaseController } = require("../../../../index.js");

class SecureRequestTestController extends BaseController {
	serve() {
		this.response.end("Secure connection established!");
	}
}

module.exports = SecureRequestTestController;
