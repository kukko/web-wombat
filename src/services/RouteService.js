let { join, dirname } = require('path');

class RouteService{
	static getRoute(request){
		for (let i in this.routes){
			if (this.routes[i].isMatching(request)){
				return this.routes[i];
			}
		}
	}
	static trimURL(url){
		if (url[0]==='/'){
			url=url.substring(1);
		}
		if (url[url.length-1]==='/'){
			url=url.substring(0, url.length-1);
		}
		return url;
	}
}

RouteService.routes=require(join(dirname(require.main.filename, 'routes', 'routes.js')));

module.exports=RouteService;