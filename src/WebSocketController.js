let BaseController = require('./BaseController.js'),
	DatabaseHolder = require('./DatabaseHolder.js'),
	WebSocketClientService = require('./WebSocketClientService.js');

class WebSocketController extends BaseController{
	constructor(request, socket, head){
		super();
		this.request = request;
		this.socket = socket;
		this.head = head;
		this.handshake();
		socket.on('data', (buffer) => {
			this.parseMessage(buffer);
		});
	}
	handshake(){
		const responseHeaders = [
			'HTTP/1.1 101 Web Socket Protocol Handshake',
			'Upgrade: WebSocket',
			'Connection: Upgrade',
			'Sec-WebSocket-Accept: ' + this.generateAcceptValue(this.request.headers['sec-websocket-key'])
		];
		this.socket.on('drain', this.onConnectListener);
		if (this.socket.write(responseHeaders.join('\r\n') + '\r\n\r\n')){
			this.onConnect();
			this.socket.removeListener('drain', this.onConnectListener);
		}
	}
	generateAcceptValue (acceptKey){
		return require('crypto')
			.createHash('sha1')
			.update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
			.digest('base64');
	}
	onConnect(){
		this.uuid = WebSocketClientService.addClient(this.socket);
	}
	onConnectListener(){
		this.onConnect();
		this.socket.removeListener('drain', this.onConnectListener);
	}
	parseMessage(buffer){
		let firstByte = buffer.readUInt8(0),
			secondByte = buffer.readUInt8(1),
			payloadLength = secondByte & 0x7F,
			isMasked = (secondByte >>> 7) & 0x1,
			isFinalFrame = firstByte >>> 7 & 0x1,
			opCode = firstByte & 0xF;
		if (opCode === 0x8){
			this.onClose();
			WebSocketClientService.removeClient(this.uuid);
			return null;
		}
		if (opCode === 0x9){
			this.pong();
			return;
		}
		if (opCode !== 0x1){
			this.onError(new Error('Unsopported frame type.'));
			return;
		}
		let offset = 2;
		if (payloadLength > 125){
			if (payloadLength === 126){
				payloadLength = buffer.readUInt16BE(offset);
				offset += 2;
			}
			else{
				let leftPart = buffer.readUInt32BE(offset),
					rightPart = buffer.readUInt32BE(offset += 4);
			}
		}
		let data = Buffer.alloc(payloadLength);
		if (isMasked){
			let maskingKeyStart = offset,
				maskingKey,
				applicationData;
			offset += 4;
			for (let i = 0; i < payloadLength; i++){
				maskingKey = buffer.readUInt8(maskingKeyStart + (i % 4));
				applicationData = buffer.readUInt8(offset++);
				data.writeInt8(applicationData ^ maskingKey, i);
			}
		}
		else{
			buffer.copy(data, 0, offset++);
		}
		this.onMessage(this.convertMessage(data));
	}
	convertMessage(buffer){
		return buffer.toString('utf8');
	}
	onOpen(){
	}
	onMessage(message){
	}
	onClose(){
	}
	onError(error){
		console.log(error);
	}
	send(message){
		this.sendMessage(this.socket, message);
	}
	sendTo(uuid, message){
		this.sendMessage(WebSocketClientService.getClientByUUID(uuid), message);
	}
	broadcast(message){
		let clients = WebSocketClientService.getClients();
		for (let uuid in clients){
			this.sendMessage(clients[uuid], message);
		}
	}
	sendMessage(socket, message){
		let byteLength = Buffer.byteLength(message),
			lengthByteCount = byteLength < 126 ? 0 : 2,
			payloadLength = lengthByteCount === 0 ? byteLength : 126,
			buffer = Buffer.alloc(2 + lengthByteCount + byteLength),
			payloadOffset = 2;
		buffer.writeUInt8(0b10000001, 0);
		buffer.writeUInt8(payloadLength, 1);
		if (lengthByteCount > 0){
			buffer.writeUInt16BE(byteLength, 2);
			payloadOffset += lengthByteCount;
		}
		buffer.write(message, payloadOffset);
		socket.write(buffer);
	}
	pong(){
		let buffer = Buffer.alloc(2);
		buffer.writeUInt8(0b10001010, 0);
		buffer.writeUInt8(0b00000000, 1);
		this.socket.write(buffer);
	}
}

module.exports = WebSocketController;