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
        let { join, resolve } = require("path"),
            servicePath = resolve(
            __dirname,
            join(serviceType, serviceType + ".js")
        );
        this.services[serviceType] = require(servicePath);
    } 
}

if (typeof ServiceProvider.services === "undefined"){
    ServiceProvider.services = {};
}

module.exports = ServiceProvider;