let StepInterface = require('../StepInterface');

class CreateAppFolder extends StepInterface{
    run(next, appName){
        let { join } = require('path'),
            { existsSync, mkdirSync } = require('fs'),
            appFolder = join(process.cwd(), appName);
        if (existsSync(appFolder)){
            console.log("\x1b[33m%s\x1b[0m", "The following folder already exists:");
            console.log("\x1b[31m%s\x1b[0m", "\t" + appFolder);
            let readline = require('readline'),
                consoleInterface = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                }),
                question = "Do you want to overwrite it's content? (y/N)";
            consoleInterface.question(`\x1b[33m${question}\x1b[0m`, (answer) => {
                answer = answer.trim();
                if (answer.length > 0){
                    answer = answer.charAt(0).toLowerCase();
                }
                else{
                    answer = "n";
                }
                switch (answer) {
                    case 'y':
                        next();
                        break;
                    case 'n':
                        process.exit();
                    default:
                        console.log("It is not a valid answer!");
                        process.exit();
                }
            });
        }
        else{
            mkdirSync(appFolder);
            next();
        }
    }
}

module.exports = CreateAppFolder;