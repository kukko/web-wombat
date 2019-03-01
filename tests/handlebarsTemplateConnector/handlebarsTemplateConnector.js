let { WombatServer, Route, templateConnectors } = require('../../index.js'),
	HandlebarsController = require('./controllers/HandlebarsController/HandlebarsController.js');

WombatServer.withoutDatabase()
	.setRoutes([
		Route.get('/existingView', HandlebarsController, 'existingView'),
		Route.get('/notExistingView', HandlebarsController, 'notExistingView')
	])
	.setTemplateConnector(templateConnectors.HandlebarsConnector)
	.setUnsecure()
	.init((port) => {
		let totalRequests = 2,
			completedRequests = 0;
		completeRequest = () => {
			completedRequests++;
			if (completedRequests === totalRequests) {
				process.exit();
			}
		};
		require('http')
			.get('http://localhost:' + port + '/existingView', (response) => {
				let data = '';
				response.on('data', (chunk) => {
					data += chunk;
				});
				response.on('end', () => {
					console.log('Existing view: ' + data);
					completeRequest();
				});
			})
			.on('error', (error) => {
				console.log(error);
				process.exit(1);
			});
		require('http')
			.get(
				'http://localhost:' + port + '/notExistingView',
				(response) => {
					let data = '';
					response.on('data', (chunk) => {
						data += chunk;
					});
					response.on('end', () => {
						console.log('Not existing view: ' + data);
						completeRequest();
					});
				}
			)
			.on('error', (error) => {
				console.log(error);
				process.exit(1);
			});
	});
