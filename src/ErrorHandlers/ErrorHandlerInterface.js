class ErrorHandlerInterface{
    static handleError(request, response, error){
		  throw new Error("You must implement the `handleError` method in your ErrorHandler.");
    }
}

module.exports = ErrorHandlerInterface;