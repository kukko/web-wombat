let BaseController = require('./BaseController.js'),
	DatabaseHolder = require('./DatabaseHolder.js');

class WebSocketController extends BaseController{
	constructor(request, socket, head){
		super();
		this.request = request;
		this.socket = socket;
		this.head = head;
		const responseHeaders = [
			'HTTP/1.1 101 Web Socket Protocol Handshake',
			'Upgrade: WebSocket',
			'Connection: Upgrade',
			'Sec-WebSocket-Accept: ' + this.generateAcceptValue(this.request.headers['sec-websocket-key'])
		];
		socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
		socket.on('data', (buffer) => {
			this.parseMessage(buffer);
		});
	}
	generateAcceptValue (acceptKey) {
		return require('crypto')
			.createHash('sha1')
			.update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
			.digest('base64');
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
			return null;
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
		this.onMessage(data.toString('utf8'));
	}
	onOpen(){
	}
	onMessage(message){
	}
	onClose(){
	}
	onError(error){
	}
}

module.exports = WebSocketController;