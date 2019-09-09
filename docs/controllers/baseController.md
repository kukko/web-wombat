#BaseController

This is a built in controller which provides some functionalities to serve HttpRequest.

It's not recommended to pass this class to a route, as a controller class, because it don't have any method shich is callable to serve a request. So you have to extend this class and pass the child class to the route.

## Usable methods in requests

During serving a request, you can call the following methods, to reach functionalities of this class.