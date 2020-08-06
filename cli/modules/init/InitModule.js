let ModuleInterface = require('../ModuleInterface.js'),
    { join } = require('path'),
    { readdirSync } = require('fs');

class InitModule extends ModuleInterface{
    run(...parameters){
        let steps = [
            'CreateAppFolder',
            'InitNpmPackage'
        ];
        for (let i in steps){
            let StepClass = require(join(__dirname, 'initSteps', steps[i], steps[i])),
                step = new StepClass();
            step.run(...parameters);
        }
    }
}

module.exports = InitModule;