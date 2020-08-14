let { lstatSync, readdirSync } = require("fs"),
	{ join, dirname, resolve } = require("path");

module.exports = {
	WombatServer: require("./src/WombatServer.js"),
	BaseController: require("./src/BaseController.js"),
	ResourceController: require("./src/ResourceController.js"),
	WebSocketController: require("./src/WebSocketController.js"),
	Route: require("./src/Route.js"),
	RouteGroup: require("./src/RouteGroup.js"),
	RouteService: require("./src/services/RouteService/RouteService.js"),
	BaseMiddleware: require("./src/middlewares/BaseMiddleware.js"),
	MiddlewareProvider: require("./src/MiddlewareProvider.js"),
	BaseCollection: require("./src/BaseCollection.js"),
	BaseDocument: require("./src/BaseDocument.js"),
	BaseField: require("./src/fieldTypes/BaseField.js"),
	fieldTypes: {
		TextField: require("./src/fieldTypes/TextField/TextField.js")
	},
	CollectionsProvider: require("./src/CollectionsProvider.js"),
	TemplateInterface: require("./src/TemplateConnectors/TemplateInterface.js"),
	templateConnectors: {
		BladeConnector: require("./src/TemplateConnectors/BladeConnector/BladeConnector.js"),
		HandlebarsConnector: require("./src/TemplateConnectors/HandlebarsConnector/HandlebarsConnector.js"),
		HTMLConnector: require("./src/TemplateConnectors/HTMLConnector/HTMLConnector.js"),
		MustacheConnector: require("./src/TemplateConnectors/MustacheConnector/MustacheConnector.js"),
		PugConnector: require("./src/TemplateConnectors/PugConnector/PugConnector.js")
	},
	ViewProvider: require("./src/ViewProvider.js"),
	FormBuilder: require("./src/FormBuilder.js"),
	AuthenticationService: require("./src/services/AuthenticationService/AuthenticationService.js"),
	AuthenticationSourceInterface: require("./src/services/AuthenticationService/AuthenticationSourceInterface.js"),
	authenticationSources: {
		DatabaseAuthenticationSource: require("./src/services/AuthenticationService/AuthenticationSources/DatabaseAuthenticationSource.js"),
		MemoryAuthenticationSource: require("./src/services/AuthenticationService/AuthenticationSources/MemoryAuthenticationSource.js")
	},
	logger: require("./src/Logger.js"),
	Config: require("./src/config/Config.js"),
	ServiceProvider: require("./src/services/ServiceProvider.js"),
	ErrorHandlerInterface: require('./src/ErrorHandlers/ErrorHandlerInterface.js'),
	errorHandler: {
		ConsoleLoggerErrorHandler: require('./src/ErrorHandlers/ConsoleLoggerErrorHandler/ConsoleLoggerErrorHandler.js'),
		TerminalErrorHandler: require('./src/ErrorHandlers/TerminalErrorHandler/TerminalErrorHandler.js')
	},
	AbstractSessionPersister: require('./src/services/SessionService/SessionPersisters/AbstractSessionPersister'),
	sessionPersisters: {
		FilePersister: require('./src/services/SessionService/SessionPersisters/FilePersister/FilePersister')
	}
};
