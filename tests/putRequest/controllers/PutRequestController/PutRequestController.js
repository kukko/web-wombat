let { BaseController } = require('../../../../index.js');

class PutRequestController extends BaseController{
	serve(request, response){
		this.view('index', request.body);
	}
}

module.exports = PutRequestController;