let { BaseController, AuthenticationService } = require("../../../../index.js");

class MainController extends BaseController{
	login(){
		AuthenticationService.authenticateUser(this.request.body.username, this.request.body.password).then((user) => {
			this.response.end(JSON.stringify(user));
		});
	}
}

module.exports = MainController;