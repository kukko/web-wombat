# web-wombat
Framework for web services with NodeJS.

With web-wombat, you can easily set up a simple webserver in 1-2 minutes.

# Create new project with web-wombat
```
mkdir wombat-project
cd wombat-project
npm init
npm install web-wombat
mkdir routes
cp node_modules/web-wombat/src/routes/example-routes.js routes/routes.js
```

# Starting a web server with WebWombat
After you successfully installed `WebWombat`, you can easily start a web server.
```
let { WombatServer } = require('web-wombat');

WombatServer.setRoutes(require('./routes/routes.js')).init();
```

Basically `WebWombat` try to load database config and connect to the database, but you can turn this behavior off with calling the `static` `withoutDatabase` method on the `WombatServer` class.

Here is an example:
```
let { WombatServer } = require('web-wombat');

WombatServer.withoutDatabase().setRoutes(require('./routes/routes.js')).init();
```

Basically `WebWombat` listening on `port 8888`, but you can override this with the `static` `setPort` method.

Example to set port for listening:
```
let { WombatServer } = require('web-wombat');

WombatServer.setPort(1222).setRoutes(require('./routes/routes.js')).init();
```

# Connect to database
You can easily connect to a MongoDB database (In the future there will be other database connectors.), but it's not mandatory.
```
mkdir config
cp node_modules/web-wombat/src/config/example-db.js config/db.js
mkdir collections
```
After this, you just need to fill in the parameters in the `config/db.js` file and WebWombat will automatically connect to the database.
When connecting to the database, WebWombat will try to create collections which you created in the `collections` folder. A collection must extends the `BaseCollection` class and must implement the `name` method. The `name` method returns a `string` which will be the collection's name in the database.

# Create routes
If you runned all the commands listed at the Installation section, you have a file at `routes/routes.js` path. In that file, there is the requires required to create routes.
The file contents is the following:
```
let { Route, MiddlewareProvider } = require('web-wombat');

module.exports=[
];
```

You can create routes for specific request methods, like `GET`, `POST`, `PUT`, `UPDATE` and `DELETE`.

Here are some example for the different methods.
GET:
```
Route.get('/', require('../controllers/HomeController/HomeController.js'))
```
POST:
```
Route.post('/', require('../controllers/HomeController/HomeController.js'))
```
PUT:
```
Route.put('/', require('../controllers/HomeController/HomeController.js'))
```
UPDATE:
```
Route.update('/', require('../controllers/HomeController/HomeController.js'))
```
DELETE:
```
Route.delete('/', require('../controllers/HomeController/HomeController.js'))
```

You can add middlewares to be runned specific for each route, by specifing an `array` as the third parameter, for the methods above. The specified middlewares run synchronously after each other, like they are ordered in the array.

Route with middlewares:
```
Route.get('/profile', require('../controllers/UserController/UserController.js'), 'showSelf', [
	MiddlewareProvider.getMiddleware('AuthenticationMiddleware')
])
```