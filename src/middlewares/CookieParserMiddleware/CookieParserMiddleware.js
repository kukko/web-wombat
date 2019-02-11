let BaseMiddleware=require('../BaseMiddleware.js');

class AuthenticationMiddleware extends BaseMiddleware{
	static run(request, response){
		let cookie=require('cookie');
		request.cookies=cookie.parse(typeof request.headers['cookie']!=='undefined'?request.headers['cookie']:'');
	}
}

module.exports=AuthenticationMiddleware;