# Route

With the route class, you can define a controller for a URL, to be runned, when a request is received to the specified route.

## Public constuctors and factory methods

### constructor(route, method, controller, [controllerFunction = "serve", middlewares = [], websocket = false, routeAliasBase = ""])

**route**
The URL where a request is received, the routes' middlewares and controller will be executed.

**method**
The HTTP method which is required to run the route.

**controller**
The controller class which will be runned when an appropriate request is received.

**controllerFunction**
The method which will be runned from the controller class when an appropriate request is received.

**middlewares**
An array with the middlewares which will be runned before the controller's self middlewares, when an appropriate request is received.

**websocket**
A variable which will indicate how this route will receive websocket connections.

**routeAliasBase**
This parameter is only take effect if a `ResourceController` is given in the controller parameter.