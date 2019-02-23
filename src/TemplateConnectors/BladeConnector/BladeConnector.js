let TemplateInterface = require('../TemplateInterface.js');

class BladeConnector extends TemplateInterface{
	constructor(request, response){
		super(request, response);
		this.blade = require('blade');
	}
	getDefaultFileExtension(){
		return '.blade';
	}
	render(filePath, options, writeToResponse=true, endResponse=true){
		if (writeToResponse){
			if (!this.response.hasHeader('Content-type')){
				this.response.setHeader('Content-type', 'text/html');
			}
			return new Promise((resolve, reject) => {
				this.blade.renderFile(filePath, {
					...options,
					basedir:this.viewFolder
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
				this.blade.renderFile(filePath, {
					...options,
					basedir:this.viewFolder
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

module.exports = BladeConnector;