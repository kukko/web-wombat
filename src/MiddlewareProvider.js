class MiddlewareProvider {
	static runMiddlewares(request, response, callback, middlewares, i = 0){
		if (i < middlewares.length) {
			return middlewares[i].run(request, response, () => {
				return this.runMiddlewares(
					request,
					response,
					callback,
					middlewares,
					i + 1
				);
			});
		} else {
			return callback(request, response);
		}
	}
	static getWebMiddlewares() {
		return [
			this.getMiddleware('BodyParserMiddleware'),
			this.getMiddleware('FormMethodParserMiddleware')
		];
	}
	static getMiddleware(name) {
		if (typeof this.middlewares[name] !== 'undefined') {
			return this.middlewares[name];
		}
		let { existsSync } = require('fs'),
			{ join, dirname } = require('path'),
			middlewareRoute = join(
				__dirname,
				'./middlewares',
				name,
				name + '.js'
			);
		if (existsSync(middlewareRoute)) {
			return (this.middlewares[name] = require(middlewareRoute));
		} else {
			middlewareRoute = join(
				dirname(require.main.filename),
				'middlewares',
				name,
				name + '.js'
			);
			if (existsSync(middlewareRoute)) {
				return (this.middlewares[name] = require(middlewareRoute));
			} else {
				throw new Error('Middleware (' + name + ') missing!');
			}
		}
	}
}

MiddlewareProvider.middlewares = [];

module.exports = MiddlewareProvider;
