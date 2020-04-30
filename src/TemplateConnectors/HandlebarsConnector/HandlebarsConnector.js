let TemplateInterface = require("../TemplateInterface.js");

class HandlebarsConnector extends TemplateInterface {
	getDefaultFileExtension() {
		return ".handlebars";
	}
	render(filePath, options, writeToResponse = true, endResponse = true) {
		let template = HandlebarsConnector.readFileSync(filePath, "utf8");
		if (writeToResponse) {
			if (!this.response.hasHeader("Content-type")) {
				this.response.setHeader("Content-type", "text/html");
			}
			return new Promise((resolve, reject) => {
				try {
					let html = HandlebarsConnector.handlebars.compile(
						template
					)(options);
					if (endResponse) {
						this.response.end(html);
					} else {
						this.response.write(html, "utf8");
					}
					resolve(html);
				} catch (e) {
					reject(e);
				}
			});
		} else {
			return new Promise((resolve, reject) => {
				try {
					resolve(
						HandlebarsConnector.handlebars.compile(template)(
							options
						)
					);
				} catch (e) {
					reject(e);
				}
			});
		}
	}
}

HandlebarsConnector.handlebars = require("handlebars");

let { readFileSync } = require("fs");
HandlebarsConnector.readFileSync = readFileSync;

module.exports = HandlebarsConnector;
