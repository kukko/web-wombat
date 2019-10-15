let { BaseController, AuthenticationService } = require("../../../../../index.js");

class RedirectUnauthorizedController extends BaseController{
	login(){
		AuthenticationService.authenticateUser(this.request.body.username, this.request.body.password).then((user) => {
			let jwt = require("jsonwebtoken"),
				signKey = require("../../config/auth.js").signKey;
			this.response.end(jwt.sign(user, signKey));
		});
	}
	userArea(){
		this.response.end("AUTHORIZED");
	}
	unauthorized(){
		this.response.end("UNAUTHORIZED");
	}
}

module.exports = RedirectUnauthorizedController;