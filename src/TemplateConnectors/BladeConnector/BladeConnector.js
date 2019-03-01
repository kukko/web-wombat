let TemplateInterface = require('../TemplateInterface.js');

class BladeConnector extends TemplateInterface {
	getDefaultFileExtension() {
		return '.blade';
	}
	render(filePath, options, writeToResponse = true, endResponse = true) {
		if (writeToResponse) {
			if (!this.response.hasHeader('Content-type')) {
				this.response.setHeader('Content-type', 'text/html');
			}
			return new Promise((resolve, reject) => {
				BladeConnector.blade.renderFile(
					filePath,
					{
						...options,
						basedir: this.viewFolder
					},
					(error, html) => {
						if (error === null) {
							if (endResponse) {
								this.response.end(html);
							} else {
								this.response.write(html, 'utf8');
							}
						} else {
							reject(error);
						}
					}
				);
			});
		} else {
			return new Promise((resolve, reject) => {
				BladeConnector.blade.renderFile(
					filePath,
					{
						...options,
						basedir: this.viewFolder
					},
					(error, html) => {
						if (error === null) {
							resolve(html);
						} else {
							reject(error);
						}
					}
				);
			});
		}
	}
}

BladeConnector.blade = require('blade');

module.exports = BladeConnector;
