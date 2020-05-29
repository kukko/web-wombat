let TemplateInterface = require("../TemplateInterface.js");

class MustacheConnector extends TemplateInterface {
	getDefaultFileExtension() {
		return ".mst";
	}
	render(filePath, options, writeToResponse = true, endResponse = true) {
		if (writeToResponse) {
			if (!this.response.hasHeader("Content-type")) {
				this.response.setHeader("Content-type", "text/html");
			}
			return new Promise((resolve, reject) => {
				try {
					let template = MustacheConnector.readFileSync(filePath, "utf8"),
						html = MustacheConnector.mustache.render(
							template,
							options
						);
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
					let template = MustacheConnector.readFileSync(filePath, "utf8");
					resolve(
						MustacheConnector.mustache.render(template, options)
					);
				} catch (e) {
					reject(e);
				}
			});
		}
	}
}

MustacheConnector.mustache = require("mustache");

let { readFileSync } = require("fs");
MustacheConnector.readFileSync = readFileSync;

module.exports = MustacheConnector;
