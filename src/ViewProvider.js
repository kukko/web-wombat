class ViewProvider{
	constructor(request, response){
		this.request=request;
		this.response=response;
		this.blade=require('blade');
		this.path=require('path');
		if (typeof ViewProvider.subfolder === 'undefined'){
			ViewProvider.setSubfolder('.');
		}
	}
	getView(filePath, options, writeToResponse=true, endResponse=true){
		let viewFolder=this.path.join(this.path.resolve(this.path.dirname(require.main.filename), ViewProvider.subfolder), 'resources', 'views'),
			viewPath=this.path.join(viewFolder, filePath),
			viewExtension=this.path.extname(viewPath);
		if (viewExtension.length===0){
			viewPath+=".blade";
		}
		if (writeToResponse){
			if (!this.response.hasHeader('Content-type')){
				this.response.setHeader('Content-type', 'text/html');
			}
			return new Promise((resolve, reject) => {
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
						reject(error);
					}
				});
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
	static setSubfolder(subfolder){
		ViewProvider.subfolder = subfolder;
	}
}

module.exports=ViewProvider;