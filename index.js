let { lstatSync, readdirSync } = require('fs'),
	{ join, dirname } = require('path'),
	middlewares = {},
	middlewaresFolder = './src/middlewares',
	middlewareFolders = readdirSync(middlewaresFolder).map((folder)=>{
		return {
			parentFolder:middlewaresFolder,
			collectionFolder:folder
		};
	}).filter((source) => {
		return lstatSync(join(source.parentFolder, source.collectionFolder)).isDirectory();
	}).map((collection)=>{
		return collection.collectionFolder
	});

for (let i in middlewareFolders){
	let middlewareName = middlewareFolders[i];
	middlewares[middlewareName] = require(join(dirname(require.main.filename), middlewaresFolder, middlewareName, middlewareName + '.js'));
}

module.exports = {
	ClientServer: require('./src/ClientServer.js'),
	BaseController: require('./src/BaseController.js'),
	Route: require('./src/Route.js'),
	BaseMiddleware: require('./src/middlewares/BaseMiddleware.js'),
	middlewares: middlewares
};