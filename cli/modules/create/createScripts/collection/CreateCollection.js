let CreationInterface = require('../CreationInterface'),
    { join } = require('path'),
    { readFileSync, mkdirSync, writeFileSync } = require('fs');

class CreateCollection extends CreationInterface{
    run(collectionName, methodName){
        if (typeof methodName === "undefined"){
            methodName = "serve";
        }
        let className = collectionName.split('-').map((item) => {
            return item.charAt(0).toUpperCase() + item.slice(1)
        }).join('') + "Collection",
            sampleFilePath = join(__dirname, 'sample'),
            sample = readFileSync(sampleFilePath, {
                encoding: 'UTF-8'
            }),
            generatedClass = sample.replace(/{{className}}/g, className).replace(/{{collectionName}}/g, collectionName),
            outputFolder = join(process.cwd(), "collections", className),
            outputFile = join(outputFolder, className + ".js");
        mkdirSync(outputFolder, {
            recursive: true
        });
        writeFileSync(outputFile, generatedClass);
        console.log("\x1b[32m%s\x1b[0m", "The '" + className + "' collection have been created in the following path:");
        console.log("\t\x1b[36m%s\x1b[0m", outputFile);
    }
}

module.exports = CreateCollection;