let DatabaseHolder = require('./DatabaseHolder.js');

class BaseController{
	constructor(request, response){
		this.request=request;
		this.response=response;
	}
	get db(){
		return new Proxy(DatabaseHolder, {
			get(target, name, receiver){
				if (typeof target[name] !== 'undefined'){
					if (typeof target.collections[name] !== 'undefined'){
						throw new Error('Resolved keyword (' + name + ') used as collection name for ' + target.collections[name].name + '.');
					}
				}
				else{
					if (typeof target.collections[name] !== 'undefined'){
						return target.collections[name];
					}
					return null;
				}
			}
		});
	}
	serve(){
		console.warn('Not implemented \'serve\' method in class: ' + this.name + '!');
	}
	view(filePath, options, writeToResponse = true, endResponse = true){
		let viewProviderObj = new BaseController.viewProvider(this.request, this.response, this.viewConnector);
		return viewProviderObj.getView(filePath, options, writeToResponse, endResponse);
	}
	getMiddleware(name){
		return BaseController.middlewareProvider.getMiddleware(name);
	}
	setViewConnector(viewConnector){
		this.viewConnector = viewConnector;
	}

	get allMiddlewares(){
		return [...this.baseMiddlewares, ...this.middlewares];
	}
	get baseMiddlewares(){
		return [
			this.getMiddleware('CookieParserMiddleware'),
			this.getMiddleware('BodyParserMiddleware'),
			this.getMiddleware('RouteVariableParserMiddleware')
		];
	}
	get middlewares(){
		return [];
	}
}

if (typeof BaseController.middlewareProvider === 'undefined'){
	BaseController.middlewareProvider = require('./MiddlewareProvider.js');
}

if (typeof BaseController.viewProvider === 'undefined'){
	BaseController.viewProvider = require('./ViewProvider.js');
}

module.exports = BaseController;