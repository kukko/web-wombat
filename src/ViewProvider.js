let TemplateInterface = require("./TemplateConnectors/TemplateInterface.js"),
	RouteService = require("./services/RouteService.js"),
	FormBuilder = require("./FormBuilder.js");

class ViewProvider {
	constructor(request, response, connector) {
		this.request = request;
		this.response = response;
		if (typeof connector !== "undefined") {
			this.setConnector(connector);
		} else {
			this.connector = new ViewProvider.DefaultConnector(
				request,
				response
			);
		}
	}
	setConnector(Connector) {
		if (typeof Connector === "undefined") {
			return false;
		}
		let connectorObj = new Connector(this.request, this.response);
		if (!(connectorObj instanceof TemplateInterface)) {
			throw new Error(
				"The " +
					connectorObj.constructor.name +
					" is not extending the TemplateInterface class."
			);
		}
		this.connector = connectorObj;
		return true;
	}
	static setDefaultConnector(Connector) {
		if (typeof Connector === "undefined") {
			return false;
		}
		if (!(Connector.prototype instanceof TemplateInterface)) {
			throw new Error(
				"The " +
					Connector.prototype.constructor.name +
					" is not extending the TemplateInterface class."
			);
		}
		this.DefaultConnector = Connector;
		return true;
	}
	getView(filePath, options = {}, writeToResponse = true, endResponse = true) {
		let { isAbsolute, resolve, join } = require("path"),
			isAbsolutePath = isAbsolute(filePath),
			viewFolder;
		if (isAbsolutePath) {
			viewFolder = resolve(__dirname, join("resources", "views"));
		} else {
			viewFolder = ViewProvider.path.join(
				ViewProvider.path.resolve(
					ViewProvider.path.dirname(require.main.filename),
					ViewProvider.subfolder
				),
				"resources",
				"views"
			);
		}
		let viewPath = isAbsolutePath
				? filePath
				: ViewProvider.path.join(viewFolder, filePath),
			viewExtension = ViewProvider.path.extname(viewPath);
		this.connector.viewFolder = viewFolder;
		if (viewExtension.length === 0) {
			viewPath += this.connector.getDefaultFileExtension();
		}
		options.RouteService = RouteService;
		options.FormBuilder = FormBuilder;
		return this.connector.render(
			viewPath,
			options,
			writeToResponse,
			endResponse
		);
	}
	static setSubfolder(subfolder) {
		ViewProvider.subfolder = subfolder;
	}
}

ViewProvider.DefaultConnector = require("./TemplateConnectors/BladeConnector/BladeConnector.js");

ViewProvider.setSubfolder(".");

if (typeof ViewProvider.path === "undefined") {
	ViewProvider.path = require("path");
}

module.exports = ViewProvider;
