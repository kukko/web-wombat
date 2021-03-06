let { assert } = require('chai'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('ServiceProvider', () => {
    let ServiceProvider;
    before(() => {
        ServiceProvider = require('../../index.js').ServiceProvider;
    });
    describe('Have attributes', () => {
        before(() => {
            ServiceProvider.clearCache();
        });
        describe('services', () => {
            it('Is object', () => {
                assert.isObject(ServiceProvider.services);
            });
            it('Is empty by default', () => {
                assert.deepEqual(ServiceProvider.services, {});
            });
        });
    });
    describe('Methods works as expected', () => {
        describe('getRouteService', () => {
            beforeEach(() => {
                sinon.spy(ServiceProvider, 'getService');
            });
            describe('Returns correct value', () => {
                it('Returned value is function', () => {
                    assert.isFunction(ServiceProvider.getRouteService());
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    ServiceProvider.getRouteService();
                });
                describe('Calls \'getService\' method', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(ServiceProvider.getService);
                    });
                    it('Called with correct values', () => {
                        assert.deepEqual(ServiceProvider.getService.getCall(0).args, [
                            'RouteService'
                        ]);
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('getSessionService', () => {
            beforeEach(() => {
                sinon.spy(ServiceProvider, 'getService');
            });
            describe('Returns correct value', () => {
                it('Returned value is function', () => {
                    assert.isFunction(ServiceProvider.getSessionService());
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    ServiceProvider.getSessionService();
                });
                describe('Calls \'getService\' method', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(ServiceProvider.getService);
                    });
                    it('Called with correct values', () => {
                        assert.deepEqual(ServiceProvider.getService.getCall(0).args, [
                            'SessionService'
                        ]);
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('getCookieService', () => {
            beforeEach(() => {
                sinon.spy(ServiceProvider, 'getService');
            });
            describe('Returns correct value', () => {
                it('Returned value is function', () => {
                    assert.isFunction(ServiceProvider.getCookieService());
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    ServiceProvider.getCookieService();
                });
                describe('Calls \'getService\' method', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(ServiceProvider.getService);
                    });
                    it('Called with correct values', () => {
                        assert.deepEqual(ServiceProvider.getService.getCall(0).args, [
                            'CookieService'
                        ]);
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('clearCache', () => {
            before(() => {
                ServiceProvider.clearCache();
                ServiceProvider.services = {
                    foo: {}
                };
            });
            it('Cache is not empty before call', () => {
                assert.notDeepEqual(ServiceProvider.services, {});
            });
            it('Cache is empty after call', () => {
                ServiceProvider.clearCache();
                assert.deepEqual(ServiceProvider.services, {});
            });
            after(() => {
                ServiceProvider.clearCache();
            });
        });
        describe('loadService', () => {
            let serviceName = 'TestService';
            describe('Path package', () => {
                before(() => {
                    let proxy = {};
                    proxy['./TestService/TestService.js'] = {
                        name: serviceName
                    };
                    ServiceProvider = proxyquire.load('../../src/services/ServiceProvider.js', proxy);
                    ServiceProvider.loadService(serviceName);
                });
                it('TestService is not undefined', () => {
                    assert.isDefined(ServiceProvider.services[serviceName]);
                });
                it('TestService is object', () => {
                    assert.isObject(ServiceProvider.services[serviceName]);
                });
                it('Loading MissingService throws exception', () => {
                    assert.throws(() => {
                        ServiceProvider.loadService('MissingService');
                    });
                });
                after(() => {
                    sinon.restore();
                });
            });
        });
        describe('getService', () => {
            let serviceName = 'TestService';
            describe('Path package', () => {
                before(() => {
                    let proxy = {};
                    proxy['./TestService/TestService.js'] = {
                        name: serviceName
                    };
                    ServiceProvider = proxyquire.load('../../src/services/ServiceProvider.js', proxy);
                    ServiceProvider.getService(serviceName);
                });
                it('TestService is not undefined', () => {
                    assert.isDefined(ServiceProvider.services[serviceName]);
                });
                it('TestService is object', () => {
                    assert.isObject(ServiceProvider.services[serviceName]);
                });
                it('Getting MissingService throws exception', () => {
                    assert.throws(() => {
                        ServiceProvider.loadService('MissingService');
                    });
                });
                describe('The loadService not called if module is already loaded', () => {
                    let serviceToBeLoadedName = 'ServiceToBeLoaded',
                        secondServiceToBeLoadedName = 'SecondService';
                    before(() => {
                        let proxy = {};
                        proxy['./' + serviceToBeLoadedName + '/' + serviceToBeLoadedName + '.js'] = {};
                        proxy['./' + secondServiceToBeLoadedName + '/' + secondServiceToBeLoadedName + '.js'] = {};
                        ServiceProvider = proxyquire.load('../../src/services/ServiceProvider.js', proxy);
                        sinon.spy(ServiceProvider, 'loadService');
                        ServiceProvider.getService(serviceToBeLoadedName);
                    });
                    it('The loadService method called only once', () => {
                        sinon.assert.calledOnce(ServiceProvider.loadService);
                    });
                    it('The loadService method was not called againg if the service is already loaded', () => {
                        ServiceProvider.getService(serviceToBeLoadedName);
                        sinon.assert.calledOnce(ServiceProvider.loadService);
                    });
                    it('The loadService method was called if the module was not loaded before', () => {
                        ServiceProvider.getService(secondServiceToBeLoadedName);
                        sinon.assert.calledTwice(ServiceProvider.loadService);
                    });
                    after(() => {
                        sinon.restore();
                    });
                });
            });
        });
    });
});