let StepInterface = require('../StepInterface'),
    switchesAndEffects = {
        global: {
        },
        WombatServer: {
            '--secure': '.setSecure()',
            '--unsecure': '.setUnsecure()'
        }
    };

class CreateIndexFile extends StepInterface{
    run(next, appName, ...parameters){
        let { join } = require('path'),
            { writeFileSync } = require('fs'),
            outputFilePath = join(process.cwd(), appName, 'index.js'),
            output = [];
        output.push("let { WombatServer } = require('web-wombat');");
        for (let switchName in switchesAndEffects.global){
            if (parameters.indexOf(switchName) !== -1){
                output.push(switchesAndEffects[switchName]);
            }
        }
        output.push("WombatServer");
        for (let switchName in switchesAndEffects.WombatServer){
            if (parameters.indexOf(switchName) !== -1){
                output.push(switchesAndEffects[switchName]);
            }
        }
        output.push(".init();");
        writeFileSync(outputFilePath, output.join('\n'));
        next();
    }
}

module.exports = CreateIndexFile;