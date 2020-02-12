let { join, dirname } = require("path"),
	RouteGroup = require("../../RouteGroup.js");

class RouteService {
	static getRoutes() {
		return this.routes;
	}
	static setRoutes(routes) {
		this.routes = routes;
	}
	static getRoute(request, routes) {
		if (typeof routes === "undefined") {
			routes = this.routes;
		}
		for (let i in routes) {
			if (Array.isArray(routes[i])) {
				let output = this.getRoute(request, routes[i]);
				if (typeof output !== "undefined") {
					return output;
				}
				continue;
			}
			let route = routes[i].isMatching(request);
			if (route) {
				return route;
			}
		}
	}
	static trimURL(url) {
		if (url[0] === "/") {
			url = url.substring(1);
		}
		if (url[url.length - 1] === "/") {
			url = url.substring(0, url.length - 1);
		}
		return url;
	}
	static getRouteByAlias(alias, parameters, routes) {
		if (typeof routes === "undefined") {
			routes = this.getRoutes();
		}
		for (let routeIndex in routes) {
			let routesIsArray = Array.isArray(routes[routeIndex]),
				routesIsGroup = routes[routeIndex] instanceof RouteGroup;
			if (routesIsArray || routesIsGroup) {
				let subRoutes;
				if (routesIsArray){
					subRoutes = routes[routeIndex];
				}
				if (routesIsGroup){
					subRoutes = routes[routeIndex].getRoutes();
				}
				let output = this.getRouteByAlias(
					alias,
					parameters,
					subRoutes
				);
				if (typeof output !== "undefined") {
					return output;
				}
				continue;
			}
			if (routes[routeIndex].alias === alias) {
				return routes[routeIndex].toString(parameters);
			}
		}
	}
}

module.exports = RouteService;
