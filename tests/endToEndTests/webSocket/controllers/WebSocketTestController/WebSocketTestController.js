let { WebSocketController } = require("../../../../../index.js"),
	logger = require("../../../../../src/Logger.js");

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
