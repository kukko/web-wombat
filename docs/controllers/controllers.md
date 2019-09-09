# Controllers

There are built in controllers, which can serve a request if you extend them, you gain useful functionalities.

[BaseController](./baseController.md)
[WebSocketController](./webSocketController.md)

In `WebWombat` to serve a request, you have to create controllers, which is called when an appropriate request arrived.

## Creating controllers

To create a controller, you have to create a file, which exports a class. The exported class don't have to have any method with a predetermined name.
When a request arrive `WebWombat` tries to find a route for it and intsantiates the provided controller class with the `request` and `response` objects as a parameter. After that it calls the method which's name is provided for the route, with the `request` and `response` objects as a parameter.

Because of the concepts of operation above, you can receive the `request` and `response` objects.

### Example for passing parameters in the constructor
```
class MainController{
    constructor(request, response){
        this.request = request;
        this.response = response;
    }
    serve(){
        this.response.end("OK");
    }
}

module.exports = MainController;
```

### Example for passing parameters in the controller method
```
class MainController{
    serve(request, response){
        response.end("OK");
    }
}

module.exports = MainController;
```