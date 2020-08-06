let CreationInterface = require('../CreationInterface'),
    { join } = require('path'),
    { readFileSync, mkdirSync, writeFileSync } = require('fs');

class CreateController extends CreationInterface{
    run(controllerName){
        let className = controllerName.charAt(0).toUpperCase() + controllerName.slice(1) + "Controller",
            sampleFilePath = join(__dirname, 'sample'),
            sample = readFileSync(sampleFilePath, {
                encoding: 'UTF-8'
            }),
            generatedClass = sample.replace(/{{className}}/g, className),
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

module.exports = CreateController;