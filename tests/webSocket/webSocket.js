let { WombatServer, Route } = require('../../index.js');
WombatServer.withoutDatabase()
	.setRoutes([
		Route.get(
			'/',
			require('../putRequest/controllers/PutRequestController/PutRequestController.js')
		),
		Route.websocket(
			'/',
			require('./controllers/WebSocketTestController/WebSocketTestController.js')
		)
	])
	.init((port) => {
		let WebSocketClient = require('websocket').client,
			ws = new WebSocketClient();
		ws.on('connectFailed', (error) => {
			throw error;
		});
		ws.on('connect', (connection) => {
			connection.on('error', (error) => {
				console.log(error);
				process.exit(1);
			});
			connection.on('message', (message) => {
				console.log('Server => Client: ' + message.utf8Data);
			});
			connection.on('close', () => {
				console.log('Client: connection closed!');
				process.exit();
			});
			console.log('Connection connected!');
			setInterval(() => {
				if (connection.socket.writable){
					connection.send('foo');
				}
				else{
					console.log('AJJJAJJJ!!!');
				}
			}, 100);
			setInterval(() => {
				if (connection.socket.writable){
					connection.ping();
				}
				else{
					console.log('Te ezt már biza nem!');
				}
			}, 1000);
			setTimeout(() => {
				connection.close();
				setTimeout(() => {
					process.exit();
				}, 2000);
			}, 3000);
		});
		ws.connect('ws://localhost:' + port);
		let ws2 = new WebSocketClient();
		ws2.on('connectFailed', (error) => {
			throw error;
		});
		ws2.on('connect', (connection) => {
			connection.on('error', (error) => {
				console.log(error);
				process.exit(1);
			});
			connection.on('message', (message) => {
				console.log('Server => Client 2: ' + message.utf8Data);
			});
			setTimeout(() => {
				connection.close();
			}, 500);
		});
		ws2.connect('wss://localhost');
	});
