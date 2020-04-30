let assert = require('chai').assert,
    sinon = require('sinon');

describe('TemplateInterface', () => {
    let TemplateInterface,
        FakeTemplateConnectorClass,
        fakeTemplateConnectorInstance;
    before(() => {
        TemplateInterface = require('../../index.js').TemplateInterface;
    });
    it('Can load TemplateInterface', () => {
        assert.isFunction(TemplateInterface);
    });
    describe('Have basic documented methods', () => {
        it('render', () => {
            assert.isFunction(TemplateInterface.prototype.render);
        });
        it('getDefaultFileExtension', () => {
            assert.isFunction(TemplateInterface.prototype.getDefaultFileExtension);
        });
    });
    describe('Class instance works as expected', () => {
        before(() => {
			class FakeTemplateConnector extends TemplateInterface{
			}
			FakeTemplateConnectorClass = FakeTemplateConnector;
        });
        describe('Class can be instantiated correctly', () => {
            let request,
                response;
            before(() => {
                request = {};
                response = {};
                fakeTemplateConnectorInstance = new FakeTemplateConnectorClass(request, response);
            });
            describe('Have basic documented attributes', () => {
                it('request', () => {
                    assert.equal(fakeTemplateConnectorInstance.request, request);
                });
                it('response', () => {
                    assert.equal(fakeTemplateConnectorInstance.response, response);
                });
            });
        });
        describe('Methods works as expected', () => {
            describe('render', () => {
                it('Throws Error', () => {
                    assert.Throw(fakeTemplateConnectorInstance.render);
                });
                it('Thrown error message is correct', () => {
                    assert.Throw(fakeTemplateConnectorInstance.render, "You must implement the render method in your TemplateConnector.");
                });
            });
            describe('getDefaultFileExtension', () => {
                it('Throws Error', () => {
                    assert.Throw(fakeTemplateConnectorInstance.getDefaultFileExtension);
                });
                it('Thrown error message is correct', () => {
                    assert.Throw(fakeTemplateConnectorInstance.getDefaultFileExtension, "You must implement getDefaultFileExtension method in your TemplateConnector.");
                });
            });
            describe('Getters and setters', () => {
                beforeEach(() => {
                    fakeTemplateConnectorInstance = new FakeTemplateConnectorClass(request, response);
                });
                describe('get viewFolder', () => {
                    describe('Returns correct value', () => {
                        it('It is return \'undefined\' by default', () => {
                            assert.isUndefined(fakeTemplateConnectorInstance.viewFolder);
                        });
                        describe('Returns previously set value', () => {
                            let viewFolder;
                            beforeEach(() => {
                                let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                viewFolder = "";
                                for (let i = 0; i < 16; i++) {
                                    viewFolder += characters.charAt(Math.floor(Math.random() * characters.length));
                                }
                                fakeTemplateConnectorInstance.viewFolder = viewFolder;
                            });
                            it('Returns correct value', () => {
                                assert.equal(fakeTemplateConnectorInstance.viewFolder, viewFolder);
                            });
                        });
                    });
                });
                describe('set viewFolder', () => {
                    describe('Can set value correctly', () => {
                        let viewFolder;
                        beforeEach(() => {
                            let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                            viewFolder = "";
                            for (let i = 0; i < 16; i++) {
                                viewFolder += characters.charAt(Math.floor(Math.random() * characters.length));
                            }
                            fakeTemplateConnectorInstance.viewFolder = viewFolder;
                        });
                        it('Calue have been set correctly', () => {
                            assert.equal(fakeTemplateConnectorInstance.viewFolder, viewFolder);
                        });
                    });
                });
            });
        });
    });
});