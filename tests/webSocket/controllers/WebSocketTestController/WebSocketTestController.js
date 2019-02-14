let { WebSocketController } = require('../../../../index.js');

class WebSocketTestController extends WebSocketController{
	onMessage(message){
		console.log('Message received: ' + message);
	}
	onClose(){
		console.log('Server: connection closed!');
	}
}

module.exports = WebSocketTestController;