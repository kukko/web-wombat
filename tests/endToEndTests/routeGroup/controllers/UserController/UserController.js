let { BaseController } = require("../../../../../index.js");

class UserController extends BaseController{
	login(){
		this.response.end("LOGGED IN!");
	}
	logout(){
		this.response.end("LOGGED OUT!");
	}
	edit(){
		this.response.end("USER EDIT!");
	}
	delete(){
		this.response.end("USER DELETE!");
	}
}

module.exports = UserController;