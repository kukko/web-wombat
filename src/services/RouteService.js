let { join, dirname } = require("path");

class RouteService {
	static getRoute(request) {
		for (let i in this.routes) {
			if (this.routes[i].isMatching(request)) {
				return this.routes[i];
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
	static setRoutes(routes) {
		this.routes = routes;
	}
	static getRoutes() {
		return this.routes;
	}
}

module.exports = RouteService;
