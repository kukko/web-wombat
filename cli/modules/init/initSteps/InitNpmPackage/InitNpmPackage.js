let StepInterface = require('../StepInterface'),
    { join } = require('path');

class InitNpmPackage extends StepInterface{
    run(next, appName){
        require('child_process').execSync('npm init -y', {
            cwd: join(process.cwd(), appName),
            stdio: [
                process.stdin, 
                null, 
                process.stderr
            ]
        });
        next();
    }
}

module.exports = InitNpmPackage;