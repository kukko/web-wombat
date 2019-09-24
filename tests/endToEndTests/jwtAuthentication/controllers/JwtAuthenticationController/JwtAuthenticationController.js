let { BaseController } = require("../../../../../index.js");

class JwtAuthenticationController extends BaseController{
	public(){
		this.response.end("OK");
	}
	authenticationRequired(){
		this.response.end("OK");
	}
}

module.exports = JwtAuthenticationController;