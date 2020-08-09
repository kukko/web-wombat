let StepInterface = require('../StepInterface');

class CopyRoutes extends StepInterface{
    run(next, appName){
        let { join } = require('path'),
            { mkdirSync, copyFileSync } = require('fs'),
            routesDirectoryPath = join(process.cwd(), appName, 'routes'),
            routesFilePath = join(routesDirectoryPath, 'routes.js');
        copyFileSync(join(__dirname, 'sample'), routesFilePath);
        next();
    }
}

module.exports = CopyRoutes;