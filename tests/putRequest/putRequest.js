let { WombatServer, Route } = require('../../index.js');
WombatServer.withoutDatabase().setRoutes([
	Route.put('/', require('./controllers/PutRequestController/PutRequestController.js'))
]).init((port)=>{
	let request = require('http').request({
		host: 'localhost',
		port: port,
		path: '/',
		method: 'PUT'
	}, (response) => {
		let data = '';
		response.on('data', (chunk) => {
			data += chunk;
		});
		response.on('end', () => {
			console.log('Response: ' + data);
			process.exit();
		})
	});
	request.on('error', (error) => {
		process.exit();
	});
	request.write('foo=bar');
	request.end();
});