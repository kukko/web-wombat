let ModuleInterface = require('../ModuleInterface.js'),
    { join } = require('path'),
    { readdirSync } = require('fs');

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
                StepClass = require(join(__dirname, 'initSteps', stepName, stepName)),
                step = new StepClass();
            console.log('\x1b[32m%s\x1b[0m', stepName);
            if (isParameterizedStep){
                step.run(next, ...steps[i].parameters, ...parameters);
            }
            else{
                step.run(next, ...parameters);
            }
        }
        else{
            process.exit();
        }
    }
}

module.exports = InitModule;