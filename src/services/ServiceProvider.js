class ServiceProvider{
    static getRouteService(){
        return this.getService('RouteService');
    }
    static getService(serviceType){
        if (typeof this.services[serviceType] === "undefined"){
            this.loadService(serviceType);
        }
        return this.services[serviceType];
    }
    static loadService(serviceType){
        let { join, resolve, relative } = require("path"),
            servicePath = "./" + serviceType + "/" + serviceType + ".js";
        this.services[serviceType] = require(servicePath);
    }
    static clearCache(){
        this.services = {};
    }
}

ServiceProvider.services = {};

module.exports = ServiceProvider;