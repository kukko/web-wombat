let { join, dirname } = require('path');

class RouteService {
	static getRoute(request, routes) {
		if (typeof routes === 'undefined'){
			routes = this.routes;
		}
		for (let i in routes) {
			if (Array.isArray(routes[i])){
				let output = this.getRoute(request, routes[i]);
				if (typeof output !=='undefined'){
					return output;
				}
				continue;
			}
			if (routes[i].isMatching(request)) {
				return routes[i];
			}
		}
	}
	static trimURL(url) {
		if (url[0] === '/') {
			url = url.substring(1);
		}
		if (url[url.length - 1] === '/') {
			url = url.substring(0, url.length - 1);
		}
		return url;
	}
	static setRoutes(routes) {
		this.routes = routes;
	}
	static getRoutes() {
		return this.routes;
	}
	static getRouteByAlias(alias, parameters, routes){
		if (typeof routes === 'undefined'){
			routes = this.getRoutes();
		}
		for (let routeIndex in routes){
			if (Array.isArray(routes[routeIndex])){
				let output = this.getRouteByAlias(alias, parameters, routes[routeIndex]);
				if (typeof output !== 'undefined'){
					return output;
				}
				continue;
			}
			if (routes[routeIndex].alias === alias){
				return routes[routeIndex].toString(parameters);
			}
		}
	}
}

module.exports = RouteService;
