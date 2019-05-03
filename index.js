let { lstatSync, readdirSync } = require("fs"),
	{ join, dirname, resolve } = require("path");

let templateConnectors = {},
	templateConnectorsFolder = resolve(__dirname, "./src/TemplateConnectors"),
	templateConnectorFolders = readdirSync(templateConnectorsFolder)
		.map((folder) => {
			return {
				parentFolder: templateConnectorsFolder,
				templateConnectorFolder: folder
			};
		})
		.filter((source) => {
			return lstatSync(
				join(source.parentFolder, source.templateConnectorFolder)
			).isDirectory();
		})
		.map((collection) => {
			return collection.templateConnectorFolder;
		});

for (let i in templateConnectorFolders) {
	let templateConnectorName = templateConnectorFolders[i];
	templateConnectors[templateConnectorName] = require(join(
		templateConnectorsFolder,
		templateConnectorName,
		templateConnectorName + ".js"
	));
}

let fieldTypes = {},
	fieldTypesFolder = resolve(__dirname, "./src/fieldTypes"),
	fieldTypeFolders = readdirSync(fieldTypesFolder)
		.map((folder) => {
			return {
				parentFolder: fieldTypesFolder,
				fieldTypeFolder: folder
			};
		})
		.filter((source) => {
			return lstatSync(
				join(source.parentFolder, source.fieldTypeFolder)
			).isDirectory();
		})
		.map((fieldType) => {
			return fieldType.fieldTypeFolder;
		});

for (let i in fieldTypeFolders) {
	let fieldTypeName = fieldTypeFolders[i];
	fieldTypes[fieldTypeName] = require(join(
		fieldTypesFolder,
		fieldTypeName,
		fieldTypeName + ".js"
	));
}

module.exports = {
	WombatServer: require("./src/WombatServer.js"),
	BaseController: require("./src/BaseController.js"),
	ResourceController: require("./src/ResourceController.js"),
	WebSocketController: require("./src/WebSocketController.js"),
	Route: require("./src/Route.js"),
	RouteGroup: require("./src/RouteGroup.js"),
	RouteService: require("./src/services/RouteService.js"),
	BaseMiddleware: require("./src/middlewares/BaseMiddleware.js"),
	MiddlewareProvider: require("./src/MiddlewareProvider.js"),
	BaseCollection: require("./src/BaseCollection.js"),
	BaseDocument: require("./src/BaseDocument.js"),
	BaseField: require("./src/fieldTypes/BaseField.js"),
	fieldTypes,
	CollectionsProvider: require("./src/CollectionsProvider.js"),
	TemplateInterface: require("./src/TemplateConnectors/TemplateInterface.js"),
	templateConnectors,
	FormBuilder: require("./src/FormBuilder.js"),
	AuthenticationService: require("./src/services/AuthenticationService/AuthenticationService.js"),
	AuthenticationSourceInterface: require("./src/services/AuthenticationService/AuthenticationSourceInterface.js"),
	authenticationSources: {
		DatabaseAuthenticationSource: require("./src/services/AuthenticationService/AuthenticationSources/DatabaseAuthenticationSource.js"),
		MemoryAuthenticationSource: require("./src/services/AuthenticationService/AuthenticationSources/MemoryAuthenticationSource.js")
	}
};
