let ErrorHandlerInterface = require('../ErrorHandlerInterface.js');

class TerminalErrorHandler extends ErrorHandlerInterface{
    static handleError(request, response, error){
        response.end(TerminalErrorHandler);
        throw error;
    }
}

module.exports = TerminalErrorHandler;