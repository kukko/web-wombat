let StepInterface = require('../StepInterface');

class CreateAppFolder extends StepInterface{
    run(appName){
        let { join } = require('path'),
            { mkdirSync } = require('fs');
        mkdirSync(join(process.cwd(), appName));
    }
}

module.exports = CreateAppFolder;