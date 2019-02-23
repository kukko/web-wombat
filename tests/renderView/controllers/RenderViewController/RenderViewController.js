let { BaseController, templateConnectors } = require('../../../../index.js');

class RenderViewController extends BaseController{
	serve(){
		this.view('index', {
			foo: 'bar'
		});
	}
}

module.exports = RenderViewController;