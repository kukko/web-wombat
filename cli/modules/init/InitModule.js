let ModuleInterface = require('../ModuleInterface.js'),
    { join } = require('path'),
    { readdirSync } = require('fs');

class InitModule extends ModuleInterface{
    run(...parameters){
        let steps = [
            'CreateAppFolder',
            'InitNpmPackage',
            'InitGitRepository',
            {
                name: 'GitCommit',
                parameters: [
                    'Initial commit'
                ]
            },
            'AddWebWombatAsDependency',
            {
                name: 'GitCommit',
                parameters: [
                    '--enhancement: DEPENDENCIES: Add web-wombat as dependency.'
                ]
            }
        ];
        for (let i in steps){
            let isParameterizedStep = typeof steps[i] === "object",
                stepName = isParameterizedStep ? steps[i].name : steps[i],
                StepClass = require(join(__dirname, 'initSteps', stepName, stepName)),
                step = new StepClass();
            if (isParameterizedStep){
                step.run(...steps[i].parameters, ...parameters);
            }
            else{
                step.run(...parameters);
            }
        }
    }
}

module.exports = InitModule;