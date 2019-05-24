let TemplateInterface = require("../TemplateInterface.js");

class HTMLConnector extends TemplateInterface {
	getDefaultFileExtension() {
		return ".html";
	}
	render(filePath, options, writeToResponse = true, endResponse = true) {
		return new Promise((resolve, reject) => {
			let html = HTMLConnector.readFileSync(filePath, "utf8");
			if (writeToResponse) {
				if (!this.response.hasHeader("Content-type")) {
					this.response.setHeader("Content-type", "text/html");
				}
				return new Promise((resolve, reject) => {
					try {
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
					resolve(html);
				});
			}
		});
	}
}

if (typeof HTMLConnector.readFileSync === "undefined") {
	let { readFileSync } = require("fs");
	HTMLConnector.readFileSync = readFileSync;
}

module.exports = HTMLConnector;
