let { BaseController } = require('../../../../index.js');

class UnsecureRequestTestController extends BaseController{
	serve(){
		this.response.end('Connection established!');
	}
}

module.exports = UnsecureRequestTestController;