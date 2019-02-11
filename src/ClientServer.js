let DatabaseHolder=require('./DatabaseHolder.js');
	RouteService=require('./services/RouteService.js'),
	BaseController=require('./BaseController.js'),
	WebMiddlewares=require('./MiddlewareProvider.js').getWebMiddlewares();

class ClientServer{
	static init(){
		DatabaseHolder.connect().then((databaseResult)=>{
			require('http').createServer(this.serve).listen(this.prototype.port);
			console.log("Listening on "+this.prototype.port+"!");
		}).catch((error)=>{
			console.log(error);
		});
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
				response.writeHead(404);
				let controller=new BaseController(request, response);
				controller.view('404', {});
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
}

ClientServer.prototype.port=8888;

module.exports=ClientServer;