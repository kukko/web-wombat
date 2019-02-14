let { WombatServer, Route } = require('../../index.js');
WombatServer.withoutDatabase().setRoutes([
	Route.get('/', require('../putRequest/controllers/PutRequestController/PutRequestController.js')),
	Route.websocket('/', require('./controllers/WebSocketTestController/WebSocketTestController.js'))
]).init((port)=>{
	let WebSocketClient = require('websocket').client,
		ws = new WebSocketClient();
		ws.on('connectFailed', (error) => {
			console.log(error);
			process.exit();
		});
		ws.on('connect', (connection) => {
			connection.on('close', () => {
				console.log('Client: connection closed!');
				process.exit();
			});
			console.log("Connection connected!");
			setInterval(() => {
				connection.send('foo');
			}, 1000);
			setTimeout(() => {
				connection.close();
			}, 5000);
		});
		ws.connect('ws://localhost:' + port);
});