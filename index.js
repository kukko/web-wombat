let { lstatSync, readdirSync } = require('fs'),
	{ join, dirname, resolve } = require('path'),
	middlewares = {},
	middlewaresFolder = resolve(__dirname, './src/middlewares'),
	middlewareFolders = readdirSync(middlewaresFolder).map((folder)=>{
		return {
			parentFolder:middlewaresFolder,
			middlewareFolder:folder
		};
	}).filter((source) => {
		return lstatSync(join(source.parentFolder, source.middlewareFolder)).isDirectory();
	}).map((collection)=>{
		return collection.middlewareFolder
	});

for (let i in middlewareFolders){
	let middlewareName = middlewareFolders[i];
	middlewares[middlewareName] = require(join(middlewaresFolder, middlewareName, middlewareName + '.js'));
}

module.exports = {
	WombatServer: require('./src/WombatServer.js'),
	BaseController: require('./src/BaseController.js'),
	Route: require('./src/Route.js'),
	BaseMiddleware: require('./src/middlewares/BaseMiddleware.js'),
	middlewares: middlewares
};