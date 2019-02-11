class MiddlewareProvider{
	static getWebMiddlewares(){
		return [];
	}
	static getMiddleware(name){
		let { existsSync } = require('fs'),
			{ join, dirname } = require('path'),
			middlewareRoute = join(__dirname, './middlewares', name, name + '.js');
		if (existsSync(middlewareRoute)){
			return require(middlewareRoute);
		}
		else{
			middlewareRoute = join(dirname(require.main.filename), 'middlewares', name, name + '.js');
			if (existsSync(middlewareRoute)){
				return require(middlewareRoute);
			}
			else{
				throw new Error('Middleware (' + name + ') missing!');
			}
		}
	}
}

module.exports=MiddlewareProvider;