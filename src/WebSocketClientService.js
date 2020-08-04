class WebSocketClientService {
	static addClient(socket, webSocketTag) {
		if (typeof this.clients[webSocketTag] === "undefined") {
			this.clients[webSocketTag] = [];
		}
		let uuid = this.generateUUID(webSocketTag);
		this.clients[webSocketTag][uuid] = socket;
		return uuid;
	}
	static removeClient(uuid, webSocketTag) {
		if (
			typeof this.clients[webSocketTag] !== "undefined" &&
			typeof this.clients[webSocketTag][uuid] !== "undefined"
		) {
			delete this.clients[webSocketTag][uuid];
			return true;
		}
		return false;
	}
	static getClientByUUID(uuid, webSocketTag) {
		if (typeof this.clients[webSocketTag] !== "undefined") {
			return this.clients[webSocketTag][uuid];
		}
		return null;
	}
	static getClients(webSocketTag) {
		return typeof this.clients[webSocketTag] !== "undefined"
			? this.clients[webSocketTag]
			: [];
	}
	static generateUUID(webSocketTag, length = 8) {
		let characters =
				"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
			output = "";
		for (let i = 0; i < length; i++) {
			output += characters[parseInt(Math.random() * characters.length)];
		}
		if (typeof this.clients[webSocketTag][output] === "undefined") {
			return output;
		}
		return this.generateUUID(webSocketTag, length);
	}
}

WebSocketClientService.clients = [];

module.exports = WebSocketClientService;
