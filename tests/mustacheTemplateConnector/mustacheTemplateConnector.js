let { WombatServer, Route, templateConnectors } = require('../../index.js');

WombatServer.withoutDatabase()
	.setRoutes([
		Route.get(
			'/existingView',
			require('./controllers/MustacheController/MustacheController.js'),
			'existingView'
		),
		Route.get(
			'/notExistingView',
			require('./controllers/MustacheController/MustacheController.js'),
			'notExistingView'
		)
	])
	.setTemplateConnector(templateConnectors.MustacheConnector)
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
