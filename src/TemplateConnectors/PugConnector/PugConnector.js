let TemplateInterface = require('../TemplateInterface.js');

class PugConnector extends TemplateInterface {
	getDefaultFileExtension() {
		return '.pug';
	}
	render(filePath, options, writeToResponse = true, endResponse = true) {
		if (writeToResponse) {
			if (!this.response.hasHeader('Content-type')) {
				this.response.setHeader('Content-type', 'text/html');
			}
			return new Promise((resolve, reject) => {
				try {
					let html = PugConnector.pug.renderFile(filePath, {
						...options,
						basedir: this.viewFolder
					});
					if (endResponse) {
						this.response.end(html);
					} else {
						this.response.write(html, 'utf8');
					}
					resolve(html);
				} catch (e) {
					reject(e);
				}
			});
		} else {
			return new Promise((resolve, reject) => {
				try {
					let html = PugConnector.pug.renderFile(filePath, {
						...options,
						basedir: this.viewFolder
					});
					resolve(html);
				} catch (e) {
					reject(e);
				}
			});
		}
	}
}

PugConnector.pug = require('pug');

module.exports = PugConnector;
