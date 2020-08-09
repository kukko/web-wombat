let ModuleInterface = require('../ModuleInterface.js'),
    { join } = require('path'),
    possibleSwitches = [];

class InitModule extends ModuleInterface{
    run(...parameters){
        let steps = [
            'CreateAppFolder',
            'InitNpmPackage',
            'InitGitRepository',
            'AddFilesToGitignore',
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
            },
            {
                name: 'CreateFolder',
                parameters: [
                    'routes'
                ]
            },
            'CopyRoutes',
            {
                name: 'CreateFolder',
                parameters: [
                    'config'
                ]
            },
            'CopyDatabaseConfig',
            'CopyAuthConfig',
            {
                name: 'CreateFolder',
                parameters: [
                    'collections'
                ]
            },
            'CreateIndexFile'
        ];
        this.runSteps(steps, 0, ...parameters);
    }
    runSteps(steps, i, ...parameters){
        if (i < steps.length){
            let next = () => {
                    this.runSteps(steps, i + 1, ...parameters);
                },
                isParameterizedStep = typeof steps[i] === "object",
                stepName = isParameterizedStep ? steps[i].name : steps[i],
                step = require(join(__dirname, 'initSteps', stepName, stepName)),
                StepClass = typeof step === "function" ? step : step.step,
                stepObject = new StepClass();
            console.log('\x1b[32m%s\x1b[0m', stepName);
            if (isParameterizedStep){
                stepObject.run(next, ...steps[i].parameters, ...parameters);
            }
            else{
                stepObject.run(next, ...parameters);
            }
        }
        else{
            process.exit();
        }
    }
}

module.exports = {
    possibleSwitches,
    module: InitModule
};