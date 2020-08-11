#WebSocketController

This is a built in controller which provides functionality to establish websocket connections and handle incoming messages and send messages to clients.

It's not recommended to pass this class to a route, as a controller class, because it's `onMessage` method, which is called when receives a message from client does nothing. So you have to extend this class and pass the child class to the route.

This class extends [BaseController](/controllers/route.md) class, so it have all functions and attributes what that class have.

## Usable methods in requests

### onOpen()

This method will be called when a client successfully connects to server through websocket. You have to override this method to do something when a client successfully connects through websocket.

### onMessage(message)

This method will be called when an already connected client sends a message through websocket. You have to override this method to handle incoming messages.

**message**

This parameter contains the received message as a string with UTF-8 encoding.

### onClose()

This method will be called when a client terminates the connection. You have to override this method to do something when a client terminates the websocket connection to the server.

### onError(error)

This method will be called when an error occurs during the communication with the client.

Possible errors:
| description | message |
|---|---|
| Unsupported frame type received. | Unsopported frame type. |

**error**

An `Error` object which contains information about the occured error.

### send(message)

You can send a message to the client which connected to this instance of the `WebSocketController`.

**message**

The message to be send to the connected client.

### sendTo(uuid, message)

With this method, you send a message to a client with the specific uuid.

**uuid**

The UUID of the client that is the recipient.

**message**

The message to send to the client. It is have to be a string.

### broadcast(message)

With this method you can send a message to every client which is connected to the specific `WebSocketController`.

**message**

The message to send to the connected clients. It is have to be a string.

### getSocketTag()

This method returns the tag that identifies the clients connected to that WebSocketController. You can get all of the clients with the return value of this method from the `WebSocketClientService`.

This tag is generated from the name of the class and the return value of the `getSocketTagPostfix` method.

### getSocketTagPostfix()

If you override this method you can specify a postfix for the socket tag, which will be added to the end of the socket tag of this controller. It have to return a string.

It is useful to override this method if you want to use the same controller for different routes. If the route have route variable, then you can use the route variable as the socket tag postfix.

By default, this method returns empty string.