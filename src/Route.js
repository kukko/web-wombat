let ResourceController = require("./ResourceController.js"),
	BaseMiddleware = require("./middlewares/BaseMiddleware.js"),
	MiddlewareProvider = require("./MiddlewareProvider.js");

class Route {
	constructor(
		route,
		method,
		controller,
		controllerFunction = "serve",
		middlewares = [],
		websocket = false,
		routeAliasBase = ""
	) {
		this.route = route;
		this.method = method;
		this.Controller = controller;
		this.controllerFunction = controllerFunction;
		this.setMiddlewares(middlewares);
		this.websocket = websocket;
		this.routeAliasBase = routeAliasBase;
	}
	setRoute(route){
		this.route = route;
		return this;
	}
	getRoute(trim = false) {
		return trim
			? require("./services/RouteService.js").trimURL(this.route)
			: this.route;
	}
	setMiddlewares(middlewares){
		this.middlewares = middlewares;
		return this;
	}
	getMiddlewares(){
		return this.middlewares;
	}
	serve(request, response) {
		if (typeof this.redirectRouteAlias !== "undefined"){
			let RouteService = require('./services/RouteService.js');
			this.redirectURL = RouteService.getRouteByAlias(this.redirectRouteAlias, request.routeVariables);
		}
		if (typeof this.redirectURL !== "undefined"){
			response.statusCode = 302;
			response.setHeader("Location", this.redirectURL);
			response.end();
			return;
		}
		return this.runController(request, response);
	}
	serveWebSocket(request, socket, head) {
		new this.Controller(request, socket, head);
	}
	runController(request, response) {
		let controllerMiddlewares = this.Controller.allMiddlewares;
		return this.runMiddlewares(request, response, typeof controllerMiddlewares !== "undefined" ? [
			...controllerMiddlewares,
			...this.getMiddlewares()
		] : [
			...this.getMiddlewares()
		]);
	}
	runMiddlewares(request, response, middlewares, i = 0) {
		if (i < middlewares.length) {
			if (middlewares[i].prototype instanceof BaseMiddleware){
				middlewares[i] = MiddlewareProvider.buildMiddleware(middlewares[i]);
			}
			return middlewares[i].middleware.run(request, response, () => {
				return this.runMiddlewares(
					request,
					response,
					middlewares,
					i + 1
				);
			}, middlewares[i].parameters);
		} else {
			let controller = new this.Controller(request, response);
			if (controller instanceof ResourceController) {
				controller.setRouteAliasBase(this.routeAliasBase);
			}
			return controller[this.controllerFunction](request, response);
		}
	}
	isMatching(request) {
		return (
			this.urlIsMatching(request) &&
			request.method === this.method &&
			request.upgrade === this.websocket
		) ? this : false;
	}
	urlIsMatching(request) {
		let routeService = require("./services/RouteService.js"),
			urlParts = routeService.trimURL(request.url).split("/"),
			routeParts = routeService.trimURL(this.route).split("/"),
			output = true;
		if (urlParts.length !== routeParts.length){
			return false;
		}
		for (let i in urlParts) {
			let isRouteVariable =
				routeParts[i].substring(
					0,
					Route.routeVariableSeparators.start.length
				) === Route.routeVariableSeparators.start &&
				routeParts[i].substring(
					routeParts[i].length -
						Route.routeVariableSeparators.end.length,
					routeParts[i].length
				) === Route.routeVariableSeparators.end;
			output &= urlParts[i] === routeParts[i] || isRouteVariable;
		}
		return output;
	}
	getRouteVariableNames() {
		let routeParts = require("./services/RouteService.js")
				.trimURL(this.route)
				.split("/"),
			output = {};
		for (let i in routeParts) {
			let isRouteVariable =
				routeParts[i].substring(
					0,
					Route.routeVariableSeparators.start.length
				) === Route.routeVariableSeparators.start &&
				routeParts[i].substring(
					routeParts[i].length -
						Route.routeVariableSeparators.end.length,
					routeParts[i].length
				) === Route.routeVariableSeparators.end;
			if (isRouteVariable) {
				output[i] = routeParts[i].substring(
					Route.routeVariableSeparators.start.length,
					routeParts[i].length -
						Route.routeVariableSeparators.end.length
				);
			}
		}
		return output;
	}
	as(alias) {
		this.alias = alias;
		return this;
	}
	redirectToURL(url){
		this.redirectURL = url;
		return this;
	}
	redirectToRoute(routeAlias){
		this.redirectRouteAlias = routeAlias;
		return this;
	}
	toString(parameters) {
		let output = this.route,
			routeParameters = output.match(
				new RegExp(
					Route.routeVariableSeparators.start +
						"[^" +
						Route.routeVariableSeparators.start +
						Route.routeVariableSeparators.end +
						"]+" +
						Route.routeVariableSeparators.end,
					"g"
				)
			);
		if (routeParameters !== null) {
			for (let i in routeParameters) {
				let variableName = routeParameters[i]
					.replace(Route.routeVariableSeparators.start, "")
					.replace(Route.routeVariableSeparators.end, "");
				if (typeof parameters[variableName] === "undefined") {
					throw new Error(
						"Required parameter '" +
							variableName +
							"' for route '" +
							this.alias +
							"' is not present!"
					);
				}
				output = output.replace(
					new RegExp(routeParameters[i], "g"),
					parameters[variableName]
				);
			}
		}
		return output;
	}
	static get(route, controller, controllerFunction, middlewares) {
		return new Route(
			route,
			"GET",
			controller,
			controllerFunction,
			middlewares
		);
	}
	static post(route, controller, controllerFunction, middlewares) {
		return new Route(
			route,
			"POST",
			controller,
			controllerFunction,
			middlewares
		);
	}
	static put(route, controller, controllerFunction, middlewares) {
		return new Route(
			route,
			"PUT",
			controller,
			controllerFunction,
			middlewares
		);
	}
	static update(route, controller, controllerFunction, middlewares) {
		return new Route(
			route,
			"UPDATE",
			controller,
			controllerFunction,
			middlewares
		);
	}
	static delete(route, controller, controllerFunction, middlewares) {
		return new Route(
			route,
			"DELETE",
			controller,
			controllerFunction,
			middlewares
		);
	}
	static websocket(route, controller, controllerFunction, middlewares) {
		return new Route(
			route,
			"GET",
			controller,
			controllerFunction,
			middlewares,
			true
		);
	}
	static resources(route, controller, middlewares) {
		let baseAlias = route.replace(/^\/+|\/+$/g, "").replace(/\//g, ".");
		return [
			new Route(
				route,
				"GET",
				controller,
				"index",
				middlewares,
				false,
				baseAlias
			).as(baseAlias + ".index"),
			new Route(
				route + "/create",
				"GET",
				controller,
				"create",
				middlewares,
				false,
				baseAlias
			).as(baseAlias + ".create"),
			new Route(
				route,
				"POST",
				controller,
				"store",
				middlewares,
				false,
				baseAlias
			).as(baseAlias + ".store"),
			new Route(
				route + "/{id}",
				"GET",
				controller,
				"show",
				middlewares,
				false,
				baseAlias
			).as(baseAlias + ".show"),
			new Route(
				route + "/{id}/edit",
				"GET",
				controller,
				"edit",
				middlewares,
				false,
				baseAlias
			).as(baseAlias + ".edit"),
			new Route(
				route + "/{id}",
				"PUT",
				controller,
				"update",
				middlewares,
				false,
				baseAlias
			).as(baseAlias + ".update"),
			new Route(
				route + "/{id}",
				"DELETE",
				controller,
				"destroy",
				middlewares,
				false,
				baseAlias
			).as(baseAlias + ".destroy")
		];
	}
}

Route.routeVariableSeparators = {
	start: "{",
	end: "}"
};

module.exports = Route;
