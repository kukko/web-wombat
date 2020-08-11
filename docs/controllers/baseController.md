#BaseController

This is a built in controller which provides some functionalities to serve HttpRequest.

It's not recommended to pass this class to a route, as a controller class, because it don't have any method which is callable to serve a request. So you have to extend this class and pass the child class to the route.

## Usable methods in requests

During serving a request, you can call the following methods, to reach functionalities of this class.

### view(filePath, options[, writeToResponse[, endResponse]])

**filePath**
The relative path of the view file in the `<APP_FOLDER>/resources/views` folder. You have to pass the view name without extension.

**options**
An object, which contains values which will be accessible in the view file.

**writeToResponse**
Default value is **true**

If this is true, the controller will automatically write the result of the view processing to the response object.

**endResponse**
Default value is **true**

If this is true, the controller will automatically end the write to the response object.

Note: The `endResponse` parameter only takes effect if the `writeToResponse` parameter is true.

### setViewConnector(viewConnector)
You can set a template connector which will be used during the processing of the current request.

Note: The default template connector is BladeConnector.

### redirect(url)
You can redirect a request to an other URL.

**url**
The URL where the request have to be redirected.

### setCookie(name, value)
With this method you can set a value to a cookie.

**name**
The name of the cookie to be setted.

**value**
The value to be set to the cookie.