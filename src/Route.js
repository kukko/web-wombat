class Route{
	constructor(route, method, controller, controllerFunction = 'serve', middlewares = [], websocket = false){
		this.route=route;
		this.method=method;
		this.controller=controller;
		this.controllerFunction=controllerFunction;
		this.middlewares=middlewares;
		this.websocket=websocket;
	}
	serve(request, response){
		let controller=new this.controller(request, response),
			requestBody='';
		if (['POST', 'PUT', 'UPDATE'].indexOf(request.method)===-1){
			this.runController(controller, request, response);
		}
		else{
			request.on('data', (chunk)=>{
				requestBody+=chunk.toString();
			});
			request.on('end', ()=>{
				request.rawBody=requestBody;
				this.runController(controller, request, response);
			});
		}
	}
	serveWebSocket(request, socket, head){
		new this.controller(request, socket, head);
	}
	runController(controller, request, response){
		for (let i in controller.allMiddlewares){
			controller.allMiddlewares[i].run(request, response);
		}
		for (let i in this.middlewares){
			this.middlewares[i].run(request, response);
		}
		if (!response.finished){
			controller[this.controllerFunction](request, response);
		}
	}
	isMatching(request){
		return this.urlIsMatching(request) && request.method===this.method && request.upgrade===this.websocket;
	}
	urlIsMatching(request){
		let routeService=require('./services/RouteService.js'),
			urlParts=routeService.trimURL(request.url).split('/'),
			routeParts=routeService.trimURL(this.route).split('/'),
			output=true;
		for (let i in urlParts){
			if (i<routeParts.length){
				let isRouteVariable=routeParts[i].substring(0, Route.routeVariableSeparators.start.length)===Route.routeVariableSeparators.start && routeParts[i].substring(routeParts[i].length-Route.routeVariableSeparators.end.length, routeParts[i].length)===Route.routeVariableSeparators.end;
				output&=urlParts[i]===routeParts[i] || isRouteVariable;
			}
			else{
				return false;
			}
		}
		return output;
	}
	getRouteVariableNames(){
		let routeParts=require('./services/RouteService.js').trimURL(this.route).split('/'),
			output={};
		for (let i in routeParts){
			let isRouteVariable=routeParts[i].substring(0, Route.routeVariableSeparators.start.length)===Route.routeVariableSeparators.start && routeParts[i].substring(routeParts[i].length-Route.routeVariableSeparators.end.length, routeParts[i].length)===Route.routeVariableSeparators.end;
			if (isRouteVariable){
				output[i]=routeParts[i].substring(Route.routeVariableSeparators.start.length, routeParts[i].length-Route.routeVariableSeparators.end.length);
			}
		}
		return output;
	}
	getRoute(trim=false){
		return trim?require('./services/RouteService.js').trimURL(this.route):this.route;
	}
	static get(route, controller, controllerFunction, middlewares){
		return new Route(route, 'GET', controller, controllerFunction, middlewares);
	}
	static post(route, controller, controllerFunction, middlewares){
		return new Route(route, 'POST', controller, controllerFunction, middlewares);
	}
	static put(route, controller, controllerFunction, middlewares){
		return new Route(route, 'PUT', controller, controllerFunction, middlewares);
	}
	static update(route, controller, controllerFunction, middlewares){
		return new Route(route, 'UPDATE', controller, controllerFunction, middlewares);
	}
	static delete(route, controller, controllerFunction, middlewares){
		return new Route(route, 'DELETE', controller, controllerFunction, middlewares);
	}
	static websocket(route, controller, controllerFunction, middlewares){
		return new Route(route, 'GET', controller, controllerFunction, middlewares, true);
	}
}

Route.routeVariableSeparators={
	start:'{',
	end:'}'
}

module.exports=Route;