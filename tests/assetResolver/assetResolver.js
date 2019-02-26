let { WombatServer } = require('../../index.js');

WombatServer.withoutDatabase().setUnsecure().setRoutes([]).init((port) => {
	require('http').get('http://localhost:' + port + '/resources/assets/images/wombat.jpg', (response) => {
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