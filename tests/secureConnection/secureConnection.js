let { WombatServer, Route } = require('../../index.js');
WombatServer.withoutDatabase()
	.setRoutes([
		Route.get(
			'/secure',
			require('./controllers/SecurityTestController/SecurityTestController.js'),
			'secure'
		),
		Route.get(
			'/unsecure',
			require('./controllers/SecurityTestController/SecurityTestController.js'),
			'unsecure'
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
					if (response.statusCode === 200){
						console.log('Unsecure connection test completed!');
						finish();
					}
					else{
						throw new Error('Can\'t establish unsecure connection!');
					}
				})
				.on('error', (error) => {
					console.log(error);
					process.exit(1);
				});
			require('https')
				.get('https://localhost/secure', (response) => {
					if (response.statusCode === 200){
						console.log('Secure connection test completed!');
						finish();
					}
					else{
						throw new Error('Can\'t establish secure connection!');
					}
				})
				.on('error', (error) => {
					console.log(error);
					process.exit(1);
				});
		});
	});
