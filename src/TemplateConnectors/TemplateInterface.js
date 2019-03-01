class TemplateInterface {
	constructor(request, response) {
		this.request = request;
		this.response = response;
	}
	render(filePath, options, writeToResponse, endResponse) {
		throw new Error(
			'You must implement the render method in your TemplateConnector.'
		);
	}
	getDefaultFileExtension() {
		throw new Error(
			'You must implement getDefaultFileExtension method in your TemplateConnector.'
		);
	}
	get viewFolder() {
		return this._viewFolder;
	}
	set viewFolder(viewFolder) {
		this._viewFolder = viewFolder;
	}
}

module.exports = TemplateInterface;
