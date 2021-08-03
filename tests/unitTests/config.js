let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('Config', () => {
    let Config;
    before(() => {
        Config = require('../../index.js').Config;
    });
    it('Can load Config', () => {
        assert.isFunction(Config);
    });
    describe('Have basic documented attributes', () => {
        it('join', () => {
            assert.isFunction(Config.join);
        });
        it('folder', () => {
            assert.isString(Config.folder);
        });
    });
    describe('Have basic documented methods', () => {
        it('GetAuth', () => {
            assert.isFunction(Config.GetAuth);
        });
        it('GetDb', () => {
            assert.isFunction(Config.GetDb);
        });
        it('GetConfig', () => {
            assert.isFunction(Config.GetConfig);
        });
        it('LoadConfig', () => {
            assert.isFunction(Config.LoadConfig);
        });
        it('setConfigFolder', () => {
            assert.isFunction(Config.setConfigFolder);
        });
    });
    describe('Methods works as expected', () => {
        let testAuthConfig,
            testDbConfig;
        before(() => {
            testAuthConfig = {};
            testDbConfig = {};
            Config = proxyquire.load('../../src/config/Config.js', {
                './auth.js': testAuthConfig,
                './db.js': testDbConfig
            });
        });
        describe('GetAuth', () => {
            let fakeGetConfig,
                fakeGetConfigReturnValue;
            beforeEach(() => {
                fakeGetConfigReturnValue = {};
                fakeGetConfig = sinon.fake(() => {
                    return fakeGetConfigReturnValue;
                });
                Config.GetConfig = fakeGetConfig;
            });
            describe('Returns correct value', () => {
                it('Returns object', () => {
                    assert.isObject(Config.GetAuth());
                });
                it('Returned value is correct', () => {
                    assert.equal(Config.GetAuth(), fakeGetConfigReturnValue);
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    Config.GetAuth();
                });
                describe('Calls \'GetConfig\' method of \'Config\' class', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(fakeGetConfig);
                    });
                    it('Called with correct parameters', () => {
                        assert.deepEqual(fakeGetConfig.getCall(0).args, [
                            'auth'
                        ]);
                    });
                });
            });
        });
        describe('GetDb', () => {
            let fakeGetConfig,
                fakeGetConfigReturnValue;
            beforeEach(() => {
                fakeGetConfigReturnValue = {};
                fakeGetConfig = sinon.fake(() => {
                    return fakeGetConfigReturnValue;
                });
                Config.GetConfig = fakeGetConfig;
            });
            describe('Returns correct value', () => {
                it('Returns object', () => {
                    assert.isObject(Config.GetDb());
                });
                it('Returned value is correct', () => {
                    assert.equal(Config.GetDb(), fakeGetConfigReturnValue);
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    Config.GetDb();
                });
                describe('Calls \'GetConfig\' method of \'Config\' class', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(fakeGetConfig);
                    });
                    it('Called with correct parameters', () => {
                        assert.deepEqual(fakeGetConfig.getCall(0).args, [
                            'db'
                        ]);
                    });
                });
            });
        });
        describe('GetConfig', () => {
            let TestConfig = {
                foo: 'bar'
            };
            describe('Specified config wasn\'t loaded before', () => {
                let loadedConfig;
                before(() => {
                    Config = proxyquire.load('../../src/config/Config.js', {
                        './test.js': TestConfig
                    });
                    sinon.spy(Config, 'LoadConfig');
                    loadedConfig = Config.GetConfig('test');
                });
                it('Retrieved config is not undefined', () => {
                    assert.isDefined(loadedConfig);
                });
                it('Config retrieved correctly', () => {
                    assert.deepEqual(loadedConfig, TestConfig);
                });
                it('The \'LoadConfig\' method was called', () => {
                    sinon.assert.calledOnce(Config.LoadConfig);
                });
                it('The \'LoadConfig\' method wasn\' called if the requested config is already loaded', () => {
                    loadedConfig = Config.GetConfig('test');
                    sinon.assert.calledOnce(Config.LoadConfig);
                });
                after(() => {
                    sinon.restore();
                });
            });
        });
        describe('LoadConfig', () => {
            let TestConfig = {
                    foo: 'bar'
                },
                loadedConfig;
            before(() => {
                Config = proxyquire.load('../../src/config/Config.js', {
                    './test.js': TestConfig
                });
                loadedConfig = Config.LoadConfig('test');
            });
            it('Returns config correctly', () => {
                assert.deepEqual(loadedConfig, TestConfig);
            })
        });
        describe('setConfigFolder', () => {
            let testFolder;
            before(() => {
                testFolder = 'foo';
                Config.setConfigFolder(testFolder);
            });
            it('The \'folder\' attribute have been modified correctly', () => {
                assert.equal(Config.folder, testFolder);
            });
        });
    });
});