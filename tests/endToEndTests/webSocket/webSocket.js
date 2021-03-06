let { WombatServer, Route } = require("../../../index.js"),
	logger = require("../../../src/Logger.js");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
WombatServer.withoutDatabase()
	.setRoutes([
		Route.get(
			"/",
			require("./controllers/PutRequestController/PutRequestController.js")
		),
		Route.websocket(
			"/",
			require("./controllers/WebSocketTestController/WebSocketTestController.js")
		)
	])
	.setSecurePort(4443)
	.setHttpsOptions({
		rejectUnauthorized: false
	})
	.init((port) => {
		let WebSocketClient = require("websocket").client,
			ws = new WebSocketClient();
		ws.on("connectFailed", (error) => {
			throw error;
		});
		ws.on("connect", (connection) => {
			connection.on("error", (error) => {
				logger.log(error);
				process.exit(1);
			});
			connection.on("message", (message) => {
				logger.log("Server => Client: " + message.utf8Data);
			});
			connection.on("close", () => {
				logger.log("Client: connection closed!");
				process.exit();
			});
			logger.log("Connection connected!");
			setInterval(() => {
				if (connection.socket.writable) {
					connection.send("foo");
				} else {
					logger.log("AJJJAJJJ!!!");
				}
			}, 100);
			setInterval(() => {
				if (connection.socket.writable) {
					connection.ping();
				} else {
					logger.log("Te ezt már biza nem!");
				}
			}, 1000);
			setTimeout(() => {
				connection.close();
				setTimeout(() => {
					process.exit();
				}, 2000);
			}, 3000);
		});
		ws.connect("ws://localhost:" + port);
		let ws2 = new WebSocketClient();
		ws2.on("connectFailed", (error) => {
			throw error;
		});
		ws2.on("connect", (connection) => {
			connection.on("error", (error) => {
				logger.log(error);
				process.exit(1);
			});
			connection.on("message", (message) => {
				logger.log("Server => Client 2: " + message.utf8Data);
			});
			setTimeout(() => {
				connection.close();
			}, 500);
		});
		ws2.connect("wss://localhost:"+WombatServer.getSecurePort());
	});
