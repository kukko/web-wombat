let StepInterface = require('../StepInterface');

class CopyDatabaseConfig extends StepInterface{
    run(next, appName){
        let { join } = require('path'),
            { mkdirSync, existsSync, readFileSync, writeFileSync } = require('fs'),
            outputFolderPath = join(process.cwd(), appName, 'config'),
            outputFilePath = join(outputFolderPath, 'db.js'),
            sampleFilePath = join(__dirname, 'sample'),
            sample = readFileSync(sampleFilePath, {
                encoding: 'UTF-8'
            }),
            generatedConfig = sample.replace(/{{appName}}/g, appName);
        writeFileSync(outputFilePath, generatedConfig);
        next();
    }
}

module.exports = CopyDatabaseConfig;