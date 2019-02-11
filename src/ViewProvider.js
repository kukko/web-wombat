class ViewProvider{
	constructor(request, response){
		this.request=request;
		this.response=response;
		this.blade=require('blade');
		this.path=require('path');
	}
	getView(filePath, options, writeToResponse=true, endResponse=true){
		let viewFolder=this.path.join(this.path.dirname(require.main.filename), 'resources', 'views'),
			viewPath=this.path.join(viewFolder, filePath),
			viewExtension=this.path.extname(viewPath);
		if (viewExtension.length===0){
			viewPath+=".blade";
		}
		if (writeToResponse){
			if (!this.response.hasHeader('Content-type')){
				this.response.setHeader('Content-type', 'text/html');
			}
			this.blade.renderFile(viewPath, {
				...options,
				basedir:viewFolder
			}, (error, html)=>{
				if (error===null){
					if (endResponse){
						this.response.end(html);
					}
					else{
						this.response.write(html, 'utf8');
					}
				}
				else{
					console.log(error);
				}
			});
		}
		else{
			return new Promise((resolve, reject) => {
				this.blade.renderFile(viewPath, {
					...options,
					basedir:viewFolder
				}, (error, html)=>{
					if (error===null){
						resolve(html);
					}
					else{
						reject(error);
					}
				});
			});
		}
	}
}

module.exports=ViewProvider;