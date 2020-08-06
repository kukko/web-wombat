let StepInterface = require('../StepInterface'),
    { join } = require('path');

class InitNpmPackage extends StepInterface{
    run(appName){
        require('child_process').execSync('npm init -y', {
            cwd: join(process.cwd(), appName),
            stdio: [
                process.stdin, 
                null, 
                process.stderr
            ]
        });
    }
}

module.exports = InitNpmPackage;