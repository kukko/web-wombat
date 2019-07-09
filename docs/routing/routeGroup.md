# RouteGroup

With the RouteGroup class, you can define a prefix for routes or can define middlewares to be runned for every request within to routes whichs is in the route group.

## Public constuctors and factory methods

### constructor(route = "", routes = [], middlewares = [])

**route**

The prefix for URL of routes within the route group.

**routes**

The array of routes for what the URL prefix and the middlewares have to be applied.

**middlewares**

The array of middlewares which have to be applied for the requests for the routes within the route group.