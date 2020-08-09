let StepInterface = require('../StepInterface');

class AddFilesToGitignore extends StepInterface{
    run(next, appName){
        let { join } = require('path'),
            { copyFileSync } = require('fs');
        copyFileSync(join(__dirname, 'sample'), join(process.cwd(), appName, '.gitignore'));
        next();
    }
}

module.exports = AddFilesToGitignore;