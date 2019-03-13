let { WebSocketController } = require("../../../../index.js"),
	{ Console } = require("console"),
	logger = new Console({ stdout: process.stdout, stderr: process.stderr });

class WebSocketTestController extends WebSocketController {
	onMessage(message) {
		logger.log("Message received: " + message);
		this.broadcast("bar");
	}
	onClose() {
		logger.log("Server: connection closed!");
	}
}

module.exports = WebSocketTestController;
