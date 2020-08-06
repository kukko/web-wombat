let ModuleInterface = require('../ModuleInterface.js'),
    { join } = require('path'),
    { readdirSync } = require('fs');

class CreateModule extends ModuleInterface{
    run(toBeCreated, ...parameters){
        let createScripts = readdirSync(join(__dirname, 'createScripts'), {
            withFileTypes: true
        }).filter((file) => {
            return file.isDirectory();
        }).map((file) => {
            return file.name;
        });
        if (createScripts.indexOf(toBeCreated) !== -1){
            let createScriptName = "Create" + toBeCreated.split('-').map((item) => {
                return item.charAt(0).toUpperCase() + item.slice(1)
            }).join(''),
                CreateScriptClass = require(join(__dirname, 'createScripts', toBeCreated, createScriptName)),
                createScript = new CreateScriptClass();
            createScript.run(...parameters);
        }
        else{
            console.log("You can't create the specified module (" + toBeCreated + ").");
            console.log("Did you mean some of the following?");
            for (let i in createScripts){
                console.log("\t" + createScripts[i]);
            }
        }
    }
}

module.exports = CreateModule;