let { lstatSync, readdirSync } = require('fs'),
	{ join, dirname, resolve } = require('path'),
	middlewares = {},
	middlewaresFolder = resolve(__dirname, './src/middlewares'),
	middlewareFolders = readdirSync(middlewaresFolder)
		.map((folder) => {
			return {
				parentFolder: middlewaresFolder,
				middlewareFolder: folder
			};
		})
		.filter((source) => {
			return lstatSync(
				join(source.parentFolder, source.middlewareFolder)
			).isDirectory();
		})
		.map((collection) => {
			return collection.middlewareFolder;
		});

for (let i in middlewareFolders) {
	let middlewareName = middlewareFolders[i];
	middlewares[middlewareName] = require(join(
		middlewaresFolder,
		middlewareName,
		middlewareName + '.js'
	));
}

let templateConnectors = {},
	templateConnectorsFolder = resolve(__dirname, './src/TemplateConnectors'),
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
		templateConnectorName + '.js'
	));
}

module.exports = {
	WombatServer: require('./src/WombatServer.js'),
	BaseController: require('./src/BaseController.js'),
	WebSocketController: require('./src/WebSocketController.js'),
	Route: require('./src/Route.js'),
	BaseMiddleware: require('./src/middlewares/BaseMiddleware.js'),
	middlewares: middlewares,
	BaseCollection: require('./src/BaseCollection.js'),
	TemplateInterface: require('./src/TemplateConnectors/TemplateInterface.js'),
	templateConnectors: templateConnectors
};
