let { WombatServer, Route, templateConnectors } = require('../../index.js');

WombatServer.withoutDatabase().setUnsecure().setTemplateConnector(templateConnectors.BladeConnector).setRoutes([
	Route.get('/', require('./controllers/RenderViewController/RenderViewController.js'))
]).init((port) => {
	require('http').get('http://localhost:'+port, (response) => {
		let data = '';
		response.on('data', (chunk) => {
			data += chunk;
		});
		response.on('end', () => {
			console.log('Response: ' + data);
			process.exit();
		})
	}).on('error', (error) => {
		console.log(error);
		process.exit();
	});
});