let { WombatServer, Route } = require('../../index.js');
WombatServer.withoutDatabase()
	.setRoutes([
		Route.get(
			'/unsecure',
			require('./controllers/UnsecureRequestTestController/UnsecureRequestTestController.js')
		),
		Route.get(
			'/secure',
			require('./controllers/SecureRequestTestController/SecureRequestTestController.js')
		)
	])
	.init((port) => {
		new Promise((resolve, reject) => {
			let finished = 0,
				finish = () => {
					finished++;
					if (finished === 2) {
						process.exit();
					}
				};
			require('http')
				.get('http://localhost:' + port + '/unsecure', (response) => {
					let data = '';
					response.on('data', (chunk) => {
						data += chunk;
					});
					response.on('end', () => {
						console.log('Unsecure response: ' + data);
						finish();
					});
				})
				.on('error', (error) => {
					console.log(error);
					process.exit(1);
				});
			require('https')
				.get('https://localhost/secure', (response) => {
					let data = '';
					response.on('data', (chunk) => {
						data += chunk;
					});
					response.on('end', () => {
						console.log('Secure response: ' + data);
						finish();
					});
				})
				.on('error', (error) => {
					console.log(error);
					process.exit(1);
				});
		});
	});
