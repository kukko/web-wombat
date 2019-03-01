let BaseMiddleware = require('../BaseMiddleware.js');

class AuthenticationMiddleware extends BaseMiddleware {
	static run(request, response, next) {
		let jwt = require('jsonwebtoken'),
			signKey = require('../../../../config/auth.js').signKey,
			token = request.cookies['jwt'];
		try {
			jwt.verify(token, signKey);
		} catch (e) {
			let ViewProvider = require('../../ViewProvider.js'),
				viewProviderObj = new ViewProvider(request, response);
			response.statusCode = 403;
			viewProviderObj.getView('403');
		}
	}
}

module.exports = AuthenticationMiddleware;
