let StepInterface = require('../StepInterface');

class CreateFolder extends StepInterface{
    run(next, folderName, appName){
        let { join } = require('path'),
            { mkdirSync, existsSync } = require('fs'),
            folderPath = join(process.cwd(), appName, folderName);
        if (!existsSync(folderPath)){
            mkdirSync(folderPath);
        }
        next();
    }
}

module.exports = CreateFolder;