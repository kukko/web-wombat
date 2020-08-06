#!/usr/bin/env node

let { join } = require('path'),
    [,, moduleParameter, ...parameters] = process.argv,
    moduleName = moduleParameter.charAt(0).toUpperCase() + moduleParameter.slice(1) + "Module",
    ModuleClass = require('./' + join('modules', moduleParameter, moduleName)),
    moduleObject = new ModuleClass();

moduleObject.run(...parameters);