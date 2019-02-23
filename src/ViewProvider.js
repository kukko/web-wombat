let TemplateInterface = require('./TemplateConnectors/TemplateInterface.js');

class ViewProvider{
	constructor(request, response, connector){
		this.request=request;
		this.response=response;
		if (typeof connector !== 'undefined'){
			this.setConnector(connector);
		}
		else{
			this.connector = new ViewProvider.defaultConnector(request, response);
		}
		this.path=require('path');
		if (typeof ViewProvider.subfolder === 'undefined'){
			ViewProvider.setSubfolder('.');
		}
	}
	setConnector(connector){
		if (typeof connector === 'undefined'){
			return false;
		}
		let connectorObj = new connector(this.request, this.response);
		if (!(connectorObj instanceof TemplateInterface)){
			throw new Error('The ' + connector.constructor.name + ' is not extending the TemplateInterface class.');
		}
		this.connector = connectorObj;
		return true;
	}
	static setDefaultConnector(connector){
		if (typeof connector === 'undefined'){
			return false;
		}
		if (!(new connector() instanceof TemplateInterface)){
			throw new Error('The ' + connector.constructor.name + ' is not extending the TemplateInterface class.');
		}
		this.defaultConnector = connector;
		return true;
	}
	getView(filePath, options, writeToResponse=true, endResponse=true){
		let viewFolder=this.path.join(this.path.resolve(this.path.dirname(require.main.filename), ViewProvider.subfolder), 'resources', 'views'),
			viewPath=this.path.join(viewFolder, filePath),
			viewExtension=this.path.extname(viewPath);
		this.connector.viewFolder = viewFolder;
		if (viewExtension.length===0){
			viewPath += this.connector.getDefaultFileExtension();
		}
		return this.connector.render(viewPath, options, writeToResponse, endResponse);
	}
	static setSubfolder(subfolder){
		ViewProvider.subfolder = subfolder;
	}
}

ViewProvider.defaultConnector = require('./TemplateConnectors/BladeConnector/BladeConnector.js');

module.exports=ViewProvider;