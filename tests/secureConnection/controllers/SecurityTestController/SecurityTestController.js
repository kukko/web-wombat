let { BaseController } = require("../../../../index.js");

class SecurityTestController extends BaseController {
	secure() {
		this.response.end("Secure connection established!");
	}
	unsecure() {
		this.response.end("Unsecure connection established!");
	}
}

module.exports = SecurityTestController;
