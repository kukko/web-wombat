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
    describe('Methods works as expected', () => {
        before(() => {
            Config = proxyquire.load('../../src/config/Config.js', {
                './auth.js': {}
            });
        });
        it('GetAuth', () => {
            assert.isDefined(Config.GetAuth());
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