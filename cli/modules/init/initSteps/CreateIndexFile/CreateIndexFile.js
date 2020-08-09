let StepInterface = require('../StepInterface'),
    switchesAndEffects = {
        global: {
        },
        WombatServer: {
            '--secure': '.setSecure()',
            '--unsecure': '.setUnsecure()',
            '--with-database': '.withDatabase()',
            '--without-database': '.withoutDatabase()'
        }
    },
    possibleSwitches = Object.keys(switchesAndEffects).reduce((r, k) => {
        return r.concat(Object.keys(switchesAndEffects[k]));
    }, []);

class CreateIndexFile extends StepInterface{
    run(next, appName, ...parameters){
        let { join } = require('path'),
            { writeFileSync } = require('fs'),
            outputFilePath = join(process.cwd(), appName, 'index.js'),
            output = [];
        output.push("let { WombatServer } = require('web-wombat');");
        for (let switchName in switchesAndEffects.global){
            if (parameters.indexOf(switchName) !== -1){
                output.push(switchesAndEffects.global[switchName]);
            }
        }
        output.push("WombatServer");
        for (let switchName in switchesAndEffects.WombatServer){
            if (parameters.indexOf(switchName) !== -1){
                output.push(switchesAndEffects.WombatServer[switchName]);
            }
        }
        output.push(".init();");
        writeFileSync(outputFilePath, output.join('\n'));
        next();
    }
}

module.exports = {
    possibleSwitches,
    step: CreateIndexFile
};