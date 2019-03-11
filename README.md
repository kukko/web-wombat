# web-wombat
Framework for web services with NodeJS.

[![Build Status](https://travis-ci.org/kukko/web-wombat.svg?branch=master)](https://travis-ci.org/kukko/web-wombat)

With web-wombat, you can easily set up a simple webserver in 1-2 minutes. You can also set up a WebSocket server in one minute.

# Create new project with web-wombat
```bash
mkdir wombat-project
cd wombat-project
npm init
npm install web-wombat
mkdir routes
cp node_modules/web-wombat/src/routes/example-routes.js routes/routes.js
```

# Starting a web server with WebWombat
After you successfully installed `WebWombat`, you can easily start a web server.
```javascript
let { WombatServer } = require('web-wombat');

WombatServer.setRoutes(require('./routes/routes.js')).init();
```

By default, `WebWombat` accepts secure connections, but it requires SSL certificate's private key and certification to be in `config/secureKey` folder in `key.pem` and `certificate.pem` files. If for some reasons you don't want to use secure connections, you can easily turn this off with the `setUnsecure` method of `WombatServer` class, before calling the `init` method.

```javascript
let { WombatServer } = require('web-wombat');

WombatServer.setUnsecure().init();
```

Basically `WebWombat` tries to load the database configuration and connect to the database, but you can turn this behavior off with calling the `static` `withoutDatabase` method on the `WombatServer` class.

Here is an example:
```javascript
let { WombatServer } = require('web-wombat');

WombatServer.withoutDatabase().setRoutes(require('./routes/routes.js')).init();
```

Basically `WebWombat` is listening on `port 8888`, but you can override this with the `static` `setPort` method.

Example to set port for listening:
```javascript
let { WombatServer } = require('web-wombat');

WombatServer.setPort(1222).setRoutes(require('./routes/routes.js')).init();
```

# Connect to database
You can easily connect to a MongoDB database (In the future there will be other database connectors.), but it's not mandatory.
```bash
mkdir config
cp node_modules/web-wombat/src/config/example-db.js config/db.js
mkdir collections
```
After this, you just need to fill in the parameters in the `config/db.js` file and WebWombat will automatically connect to the database.
When connecting to the database, WebWombat will try to create collections which you created in the `collections` folder. A collection must extend the `BaseCollection` class and must implement the `name` method. The `name` method returns a `string` which will be the collection's name in the database.

# Create routes
If you run all the commands listed at the Installation section, you have a file at `routes/routes.js` path. In that file, there is the requires required to create routes.
The file contents are the following:
```javascript
let { Route, MiddlewareProvider } = require('web-wombat');

module.exports=[
];
```

You can create routes for specific request methods, like `GET`, `POST`, `PUT`, `UPDATE` and `DELETE`.

Here are some examples for the different methods.

GET:
```javascript
Route.get('/', require('../controllers/HomeController/HomeController.js'))
```
POST:
```javascript
Route.post('/', require('../controllers/HomeController/HomeController.js'))
```
PUT:
```javascript
Route.put('/', require('../controllers/HomeController/HomeController.js'))
```
UPDATE:
```javascript
Route.update('/', require('../controllers/HomeController/HomeController.js'))
```
DELETE:
```javascript
Route.delete('/', require('../controllers/HomeController/HomeController.js'))
```

In one controller, you can specify any method to serve a request and multiple routes can point to the same controller and to the same method, or to the same controller, but different methods. As the third parameter of the above methods, you can specify a method name, which will serve the requests. If this parameter isn't specified, then the controller's `serve` method will handle the request to the route.

Here is an example:
```javascript
Route.get('/profile', require('../controllers/UserController/UserController.js'), 'showSelf')
```

You can add middlewares to be run specific for each route, by specifying an `array` as the fourth parameter, for the methods above. The specified middlewares run synchronously after each other, like they are ordered in the array.

Route with middlewares:
```javascript
Route.get('/profile', require('../controllers/UserController/UserController.js'), 'showSelf', [
	MiddlewareProvider.getMiddleware('AuthenticationMiddleware')
])
```

## WebSocket
And you can create websocket servers with `WebWombat`. For this, you need to specify a route, with the `Route` class's `websocket` method.

Here is an example:
Specify route:
```javascript
Route.websocket('/', require('./controllers/WebSocketTestController/WebSocketTestController.js'))
```
Create controller for websocket:
```javascript
let { WebSocketController } = require('../../../../index.js');

class WebSocketTestController extends WebSocketController{
	onOpen(){
		console.log('Connection opened!');
	}
	onMessage(message){
		console.log('Message received: ' + message);
	}
	onClose(){
		console.log('Server: connection closed!');
	}
	onError(error){
		console.log('Error occured!');
		console.log(error);
	}
}

module.exports = WebSocketTestController;
```

# Available classes
*These are just those classes and their methods which is accessible from outside of the class and you can do something with them, without the deeper knowledge of the classes.*
## WombatServer
### init([function callback])
Initialize the `WombatServer` to listen on a port for requests.

**callback:**
It's a function which will be called after the `WombatServer` started listening.
### setUnsecure()
Disables the listening for secure connections. Must be called before init method. Basically `WombatServer` listening for secure connections too.
### setSecure()
Enables the listening for secure connections. Must be called before init method. Basically `WombatServer` listening for secure connections too. Calling this method is only required if you previously called `setUnsecure` method.
### withDatabase()
Configure `WombatServer` to load the database configuration and connect to the database on startup.
### withoutDatabase()
Configure `WombatServer` to not try to load the database configuration and don't try to connect to database on startup.
### setPort(mixed port)
Set the port where the WombatServer will listen for requests.

**port:**
The port where the `WombatServer` will listen for requests.
### setRoutes(Route[] routes)
Set the routes, which will be redirected to Controllers.

**routes:**
An array of `Route` instances.
### setSubfolder(string subfolder)
You can set a path where the `WombatServer` and the dependant classes find the resources relatively to the file, which have been started by `node`.

**subfolder:**
A relative path where the required resources can be found relatively to the running script file.

## BaseController
This is the class which must be the parent class of each controller.
### view(string filePath, object options, [boolean writeToResponse = true, boolean endResponse = true])
**filePath:**
Route to the view, in the `resources/views` folder.

**options:**
An object with the variables which will be accessible in the view file.

**writeToResponse:**
If this parameter is `true`, the controller will write the builded template to the ServerResponse, else the controller will return a promise which's then branch will receive the builded output as first parameter.

**endResponse:**
If this parameter is `true`, the controller will end the response after it's writed the builded template to it. If the `writeToResponse` parameter is `false`, then this parameter will be ignored.
### getMiddleware(string name)
This method will return the request middleware class, not an instance of the class. First this will find the middleware in the `web-wombat` module folder, after that in the projects `middlewares` folder.

**name:**
The name of the required `middleware` class.

## WebSocketController
This is the class which must be the parent class of each WebSocket controller. The following methods called automatically by this class and the classes which have been extends this parent class, just need to implement these classes. None of them are required to override, just optional.
### onOpen()
Called when a client have been connected.
### onMessage(string message)
Called when a client sent a message to the server.

**message:**
Contains the message which the client have been sent to the server.
### onClose()
Called when a client have been disconnected from the server.
### onError(Error error)
Called when an error occured in the connection.

**error:**
Contains the error which is occured in the WebSocket connection.
### send(mixed message)
Sends the specified message to the connected user.

**message:**
The message to be sended to the client connected to this controller.
### sendTo(string uuid, mixed message)
Send the provided message to the client identified by the specified uuid.

**uuid:**
The uuid of the client which is the target of the provided message.

**message:**
The message to be sended to the client with the provided uuid.
### broadcast(mixed message)
Sends the provided message to all connected clients.

**message:**
The message to be sended to all connected clients.

### getSocketTag()
**If you have two controllers which have extends the `WebSocketController` class they shouldn't have the same name.**

**If you override it you should be cautious how two class which extends the `WebSocketController` shouldn't return the same value from this method and they don't have the same name.**

Returns the tag of the WebSocket controller to be able to make more WebSocket controller in one application. The client's will be grouped by the tag returned by this method. By default it's return the name of the controller class. You shouldn't override this method.

## ViewProvider
This is the class through which you can build views.
### setSubfolder(string subfolder)
You can set a path where the `ViewProvider` can find the resources relatively to the file, which have been started by `node`.

**subfolder:**
A relative path where the required resources can be found relatively to the running script file.