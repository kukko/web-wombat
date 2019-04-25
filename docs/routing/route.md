# Route

With the route class, you can define a controller for a URL, to be runned, when a request is received to the specified route.

## Route variables
You can create routes which contains variable parts. the variable parts need to encase the part with braces. The variable name will be the same as the string between the braces.

You can access these variables in middlewares and controllers from the request object in the `routeVariables` attribute.

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

### get(route, controller, [controllerFunction, middlewares])
Returns a Route object, which will match requests with GET HTTP method.

**route**
The URL where a request is received, the routes' middlewares and controller will be executed.

**controller**
The controller class which will be runned when an appropriate request is received.

**controllerFunction**
The method which will be runned from the controller class when an appropriate request is received.

If not specified, it will have the same default value as the `Route` class' constructor.

**middlewares**
An array with the middlewares which will be runned before the controller's self middlewares, when an appropriate request is received.

If not specified, it will have the same default value as the `Route` class' constructor.

### post(route, controller, [controllerFunction, middlewares])
Returns a Route object, which will match requests with POST HTTP method.

Have the same signature as the `get` factory method.

### put(route, controller, [controllerFunction, middlewares])
Returns a Route object, which will match requests with PUT HTTP method.

Have the same signature as the `get` factory method.

### update(route, controller, [controllerFunction, middlewares])
Returns a Route object, which will match requests with UPDATE HTTP method.

Have the same signature as the `get` factory method.

### delete(route, controller, [controllerFunction, middlewares])
Returns a Route object, which will match requests with DELETE HTTP method.

Have the same signature as the `get` factory method.

### websocket(route, controller, [controllerFunction, middlewares])
Returns a Route object, which will accept websocket connections.

Have the same signature as the `get` factory method.

### resources(route, controller, [middlewares])
Returns an array of instances of the Route class. With this factory method, you can easily create a REST service, which will be able to list, create, fetch, edit and delete entities.

**route**
The prefix of the routes which will be returned by the method.

**controller**
You can pass any controller class, but it is recommended to pass a class which extends the `ResourceController` class.

**middlewares**
An array with the middlewares which will be runned before the controller's self middlewares, when an appropriate request is received.

If not specified, it will have the same default value as the `Route` class' constructor.
