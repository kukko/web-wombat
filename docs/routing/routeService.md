# RouteService

With the `RouteService` you can get routes by it's aliases.

## Getting routes

### getRouteByAlias(alias, parameters, routes)
With this method, you can get a route as string from an array of routes, by it's alias.

**alias**
The alias of the sought route.

**parameters**
An object with the route variables which will be inserted into the returned route instead of the variabling parts of the route.

**routes**
An array where the `RouteService` will look for the sought route.

It's should not be passed, because by default the `RouteService` will look for route between the previously setted routes.