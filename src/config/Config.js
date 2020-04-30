class Config {
    static GetAuth() {
        return Config.GetConfig('auth');
    }
    static GetConfig(configType) {
        if (typeof Config[configType] === "undefined") {
            Config[configType] = Config.LoadConfig(configType);
        }
        return Config[configType];
    }
    static LoadConfig(configType) {
        return require("./" + configType + ".js");
    }
}

module.exports = Config;