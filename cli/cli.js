#!/usr/bin/env node

let { join } = require('path'),
    [,, moduleParameter, ...parameters] = process.argv,
    moduleName = moduleParameter.charAt(0).toUpperCase() + moduleParameter.slice(1) + "Module",
    requiredModule = require('./' + join('modules', moduleParameter, moduleName)),
    ModuleClass = typeof requiredModule === "function" ? requiredModule : requiredModule.module,
    moduleObject = new ModuleClass();

moduleObject.run(...parameters);