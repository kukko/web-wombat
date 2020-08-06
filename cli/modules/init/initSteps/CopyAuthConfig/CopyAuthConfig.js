let StepInterface = require('../StepInterface');

class CopyAuthConfig extends StepInterface{
    run(next, appName){
        let { join } = require('path'),
            { mkdirSync, existsSync, readFileSync, writeFileSync } = require('fs'),
            outputFolderPath = join(process.cwd(), appName, 'config'),
            outputFilePath = join(outputFolderPath, 'auth.js'),
            sampleFilePath = join(__dirname, 'sample'),
            sample = readFileSync(sampleFilePath, {
                encoding: 'UTF-8'
            }),
            signKey = (() => {
                let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    output = "";
                for (let i = 0; i < 10; i++){
                    output += chars[Math.floor(Math.random() * chars.length)];
                }
                return output;
            })(),
            generatedConfig = sample.replace(/{{signKey}}/g, signKey);
        if (!existsSync(outputFolderPath)){
            mkdirSync(outputFolderPath);
        }
        writeFileSync(outputFilePath, generatedConfig);
        next();
    }
}

module.exports = CopyAuthConfig;