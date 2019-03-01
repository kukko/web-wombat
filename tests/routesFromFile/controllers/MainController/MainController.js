let { BaseController } = require('../../../../index.js');

class MainController extends BaseController {
	serve() {
		this.response.end('Foo!');
	}
}

module.exports = MainController;
