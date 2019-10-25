let Route = require("./Route.js");

class RouteGroup{
	constructor(route = "", routes = [], middlewares = []){
		this.route = route;
		for (let routeIndex in routes){
			let currentRoute = routes[routeIndex];
			if (!(currentRoute instanceof Route) && !(currentRoute instanceof RouteGroup)){
				throw new Error("Element in provided array at position " + routeIndex + " is not an instance of `Route` or `RouteGroup`.");
			}
		}
		this.routes = routes;
		this.setRoute(this.route);
		this.setMiddlewares(middlewares);
	}
	isMatching(request){
		for (let routeIndex in this.routes){
			let route = this.routes[routeIndex],
				matchingRoute = route.isMatching(request);
			if (matchingRoute){
				return matchingRoute;
			}
		}
		return false;
	}
	setRoute(route){
		for (let routeIndex in this.routes){
			let currentRoute = this.routes[routeIndex];
			currentRoute.setRoute((route !== this.route ? route.replace(this.route, "") : route) + currentRoute.getRoute());
		}
		return this;
	}
	getRoute(){
		return this.route;
	}
	getRoutes(){
		return this.routes;
	}
	setMiddlewares(middlewares){
		if (typeof this.middlewares === "undefined"){
			this.middlewares = middlewares;
		}
		for (let routeIndex in this.routes){
			let currentRoute = this.routes[routeIndex];
			if (currentRoute instanceof Route){
				currentRoute.setMiddlewares([
					...middlewares,
					...currentRoute.getMiddlewares()
				]);
			}
			else if (currentRoute instanceof RouteGroup){
				currentRoute.setMiddlewares(middlewares);
			}
		}
	}
	getMiddlewares(){
		return this.middlewares;
	}
}

module.exports = RouteGroup;