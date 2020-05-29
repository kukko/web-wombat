let { WombatServer, Route, BaseController } = require('./index.js');

class TestController extends BaseController{
    serve(){
        this.response.end("CITROMOSBUKTA");
        throw new Error("CITROMOSBUKTA");
    }
}

WombatServer.withoutDatabase().setUnsecure().setRoutes([
    Route.get('/', TestController)
]).init();