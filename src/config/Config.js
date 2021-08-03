class Config {
    static GetAuth() {
        return Config.GetConfig('auth');
    }
    static GetDb(){
        return Config.GetConfig('db');
    }
    static GetConfig(configType) {
        if (typeof Config[configType] === "undefined") {
            Config[configType] = Config.LoadConfig(configType);
        }
        return Config[configType];
    }
    static LoadConfig(configType) {
        return require(this.join(this.folder, configType + ".js"));
    }
    static setConfigFolder(folder){
        this.folder = folder;
    }
}

Config.folder = __dirname;
let { join } = require('path');
Config.join = join;

module.exports = Config;