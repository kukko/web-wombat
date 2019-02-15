class WebSocketClientService{
	static addClient(socket){
		let uuid = this.generateUUID();
		this.clients[uuid] = socket;
		return uuid;
	}
	static removeClient(uuid){
		if (typeof this.clients[uuid] !== 'undefined'){
			delete this.clients[uuid];
			return true;
		}
		return false;
	}
	static getClientByUUID(uuid){
		return this.clients[uuid];
	}
	static getClients(){
		return this.clients;
	}
	static generateUUID(length = 8){
		let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			output = '';
		for (let i = 0; i < length; i++){
			output += characters[parseInt(Math.random() * characters.length)];
		}
		if (typeof this.clients[output] === 'undefined'){
			return output;
		}
		return this.generateUUID(length);
	}
}

WebSocketClientService.clients = [];

module.exports = WebSocketClientService;