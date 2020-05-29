let ErrorHandlerInterface = require('../ErrorHandlerInterface.js');

class ConsoleLoggerErrorHandler extends ErrorHandlerInterface{
    static handleError(request, response, error){
        console.log(new Date());
        console.log("Client IP: " + request.connection.remoteAddress);
        console.log(error);
        if (!response.writeableEnded){
            response.statusCode = 500;
            response.end();
        }
    }
}

module.exports = ConsoleLoggerErrorHandler;