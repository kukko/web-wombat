let CreationInterface = require('../CreationInterface'),
	{ join } = require('path'),
	{ readFileSync, mkdirSync, writeFileSync } = require('fs');

class CreateWebSocketController extends CreationInterface{
	run(controllerName, methodName){
        if (typeof methodName === "undefined"){
            methodName = "serve";
        }
		let className = controllerName.split('-').map((item) => {
            return item.charAt(0).toUpperCase() + item.slice(1)
        }).join('') + "Controller",
			sampleFilePath = join(__dirname, 'sample'),
			sample = readFileSync(sampleFilePath, {
				encoding: 'UTF-8'
			}),
			generatedClass = sample.replace(/{{className}}/g, className).replace(/{{methodName}}/g, methodName),
			outputFolder = join(process.cwd(), "controllers", className),
			outputFile = join(outputFolder, className + ".js");
		mkdirSync(outputFolder, {
			recursive: true
		});
		writeFileSync(outputFile, generatedClass);
		console.log("\x1b[32m%s\x1b[0m", "The '" + className + "' controller have been created in the following path:");
		console.log("\t\x1b[36m%s\x1b[0m", outputFile);
	}
}

module.exports = CreateWebSocketController;