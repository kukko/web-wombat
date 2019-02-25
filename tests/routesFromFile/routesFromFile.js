let { WombatServer } = require('../../index.js');

WombatServer.withoutDatabase().setUnsecure().init((port) => {
	require('http').get('http://localhost:' + port, (response) => {
		let data = '';
		response.on('data', (chunk) => {
			data += chunk;
		});
		response.on('end', () => {
			console.log('Unsecure response: ' + data);
			process.exit();
		})
	}).on('error', (error) => {
		console.log(error);
		process.exit();
	});
});