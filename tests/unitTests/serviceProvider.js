let { assert } = require('chai'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('ServiceProvider', () => {
    let ServiceProvider = require('../../index.js').ServiceProvider;
    before(() => {
        ServiceProvider.clearCache();
    });
    describe('Have attributes', () => {
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
        describe('clearCache', () => {
            before(() => {
                ServiceProvider.services = {
                    foo: () => {}
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
            /*describe('Path package', () => {
                before(() => {
                    let serviceName = 'TestService',
                        proxy = {};
                    proxy['./TestService/TestService.js'] = {
                        name: serviceName,
                        '@noCallThru': true
                    };
                    proxyquire('d:\\GitHub\\web-wombat\\src\\services\\ServiceProvider.js', proxy);
                    ServiceProvider.loadService(serviceName);
                });
                it('Join called once', () => {
                    sinon.assert.calledOnce(joinFake);
                });
                it('Resolve called once', () => {
                    sinon.assert.calledOnce(resolveFake);
                });
            });
            after(() => {
                sinon.restore();
            });*/
        });
    });
});