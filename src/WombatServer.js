let DatabaseHolder=require('./DatabaseHolder.js');
	RouteService=require('./services/RouteService.js'),
	BaseController=require('./BaseController.js'),
	ViewProvider=require('./ViewProvider.js'),
	WebMiddlewares=require('./MiddlewareProvider.js').getWebMiddlewares();

class WombatServer{
	static init(callback){
		if (typeof WombatServer.subfolder === 'undefined'){
			this.setSubfolder('.');
		}
		if (this.connectToDatabase){
			DatabaseHolder.connect().then((databaseResult)=>{
				this.listen(callback);
			}).catch((error)=>{
				console.log(error);
			});
		}
		else{
			this.listen(callback);
		}
	}
	static withDatabase(){
		this.connectToDatabase = true;
		return this;
	}
	static withoutDatabase(){
		this.connectToDatabase = false;
		return this;
	}
	static setPort(port){
		this.port = port;
		return this;
	}
	static setRoutes(routes){
		RouteService.setRoutes(routes);
		return this;
	}
	static setSubfolder(subfolder){
		this.subfolder = subfolder;
		ViewProvider.setSubfolder(subfolder);
		return this;
	}
	static listen(callback){
		require('http').createServer(this.serve).listen(this.port).on('listening', ()=>{
			console.log("Listening on " + this.port + "!");
			if (typeof callback !== 'undefined'){
				callback(this.port);
			}
		}).on('upgrade', this.serveWebSocket);
	}
	static serve(request, response){
		let route=RouteService.getRoute(request);
		if (typeof route!=="undefined"){
			request.route=route;
			route.serve(request, response);
		}
		else{
			let path=require('path');
			if (path.extname(request.url).length===0){
				response.statusCode = 404;
				let controller=new BaseController(request, response);
				controller.view('404', {}).catch((error) => {
					response.end('404');
				});
			}
			else{
				let fileSystem=require('fs'),
					resourcePath=path.join(path.dirname(require.main.filename), request.url);
				if (fileSystem.existsSync(resourcePath)){
					let responseHeaders={};
					if (typeof request.headers['accept']!=='undefined'){
						responseHeaders['Content-type']=request.headers['accept'].split(',')[0];
					}
					response.writeHead(200, responseHeaders);
					fileSystem.createReadStream(resourcePath).pipe(response);
				}
				else{
					response.writeHead(404);
					response.end("404");
				}
			}
		}
	}
	static serveWebSocket(request, socket, head){
		let route=RouteService.getRoute(request);
		if (typeof route !== "undefined"){
			request.route = route;
			route.serveWebSocket(request, socket, head);
		}
	}
}

WombatServer.port = 8888;

WombatServer.connectToDatabase = true;

module.exports=WombatServer;