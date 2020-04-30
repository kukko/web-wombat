let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('BladeConnector', function() {
    let BladeConnector,
        bladeConnectorInstance,
        request = {},
        response = {};
    before(() => {
        BladeConnector = require('../../index.js').templateConnectors.BladeConnector;
    });
    it('Can load BladeConnector', () => {
        assert.isFunction(BladeConnector);
    });
    it('BladeConnector loaded \'blade\' module', () => {
        assert.isObject(BladeConnector.blade);
    });
    it('The \'viewFolder\' attribute is undefined', () => {
        assert.isUndefined(BladeConnector.viewFolder);
    });
    describe('It can be instantiated properly', () => {
        before(() => {
            bladeConnectorInstance = new BladeConnector(request, response);
        });
        it('Object have been instantated', () => {
            assert.isObject(bladeConnectorInstance);
        });
        it('The \'request\' attribute have been set', () => {
            assert.equal(bladeConnectorInstance.request, request);
        });
        it('The \'response\' attribute have been set', () => {
            assert.equal(bladeConnectorInstance.response, response);
        });
    });
    describe('Methods works as expected', () => {
        before(() => {
            bladeConnectorInstance = new BladeConnector(request, response);
        });
        it('getDefaultFileExtension', () => {
            assert.equal(bladeConnectorInstance.getDefaultFileExtension(), '.blade');
        });
        describe('render', () => {
            describe('Called with default parameters', () => {
                beforeEach(() => {
                    BladeConnector.blade.renderFile = sinon.fake((filePath, options, callback) => {
                        callback(null, JSON.stringify({
                            filePath,
                            options
                        }));
                    });
                    response.hasHeader = sinon.fake(() => {
                        return false;
                    });
                    response.setHeader = sinon.fake();
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'render\' method have been called from mustache', (done) => {
                    bladeConnectorInstance.render('testView', {}).then(() => {
                        sinon.assert.calledOnce(BladeConnector.blade.renderFile);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    bladeConnectorInstance.render('testView', {}).then((renderedView) => {
                        assert.equal(renderedView, JSON.stringify({
                            filePath: 'testView',
                            options: {
                                basedir: undefined
                            }
                        }));
                        done();
                    });
                });
                it('The response object\'s \'write\' method wasn\'t called', (done) => {
                    bladeConnectorInstance.render('testView', {}).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    bladeConnectorInstance.render('testView', {}).then((renderedView) => {
                        sinon.assert.calledOnce(response.end);
                        done();
                    });
                });
                describe('The response object\'s \'setHeader\' method returns false', () => {
                    beforeEach(() => {
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.setHeader);
                            done();
                        });
                    });
                });
                describe('The response object\'s \'setHeader\' method returns true', () => {
                    beforeEach(() => {
                        response.hasHeader = sinon.fake(() => {
                            return true;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.notCalled(response.setHeader);
                            done();
                        });
                    });
                });
                afterEach(() => {
                    sinon.restore();
                });
            });
            describe('The \'writeToResponse\' parameter is false', () => {
                beforeEach(() => {
                    BladeConnector.blade.renderFile = sinon.fake((filePath, options, callback) => {
                        callback(null, JSON.stringify({
                            filePath,
                            options
                        }));
                    });
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'renderFile\' method have been called from mustache', (done) => {
                    bladeConnectorInstance.render('testView', {}, false).then(() => {
                        sinon.assert.calledOnce(BladeConnector.blade.renderFile);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    bladeConnectorInstance.render('testView', {}, false).then((renderedView) => {
                        assert.equal(renderedView, JSON.stringify({
                            filePath: 'testView',
                            options: {
                                basedir: undefined
                            }
                        }));
                        done();
                    });
                });
                it('The response object\'s \'write\' method wasn\'t called', (done) => {
                    bladeConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    bladeConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
                        sinon.assert.notCalled(response.end);
                        done();
                    });
                });
                describe('The response object\'s \'setHeader\' method returns false', () => {
                    beforeEach(() => {
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.setHeader);
                            done();
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('The response object\'s \'setHeader\' method returns true', () => {
                    beforeEach(() => {
                        response.hasHeader = sinon.fake(() => {
                            return true;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.notCalled(response.setHeader);
                            done();
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('The promise have been rejected on error', () => {
                    beforeEach(() => {
                        BladeConnector.blade.renderFile = sinon.fake((filePath, options, callback) => {
                            callback(new Error());
                        });
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        bladeConnectorInstance.render('testView', {}, false, false).catch(() => {
                            sinon.assert.calledOnce(BladeConnector.blade.renderFile);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
                            sinon.assert.notCalled(response.end);
                            done();
                        });
                    });
                });
                afterEach(() => {
                    sinon.restore();
                });
            });
            describe('The \'writeToResponse\' parameter is true', () => {
                beforeEach(() => {
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                describe('The \'endResponse\' parameter is false', () => {
                    beforeEach(() => {
                        BladeConnector.blade.renderFile = sinon.fake((filePath, options, callback) => {
                            callback(null, JSON.stringify({
                                filePath,
                                options
                            }));
                        });
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, false).then(() => {
                            sinon.assert.calledOnce(BladeConnector.blade.renderFile);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            assert.equal(renderedView, JSON.stringify({
                                filePath: 'testView',
                                options: {
                                    basedir: undefined
                                }
                            }));
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            sinon.assert.calledOnce(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            sinon.assert.notCalled(response.end);
                            done();
                        });
                    });
                    describe('The response object\'s \'setHeader\' method returns false', () => {
                        beforeEach(() => {
                            response.hasHeader = sinon.fake(() => {
                                return false;
                            });
                            response.setHeader = sinon.fake();
                        });
                        it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.setHeader);
                                done();
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    describe('The response object\'s \'setHeader\' method returns true', () => {
                        beforeEach(() => {
                            response.hasHeader = sinon.fake(() => {
                                return true;
                            });
                            response.setHeader = sinon.fake();
                        });
                        it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.notCalled(response.setHeader);
                                done();
                            });
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('The \'endResponse\' parameter is true', () => {
                    beforeEach(() => {
                        BladeConnector.blade.renderFile = sinon.fake((filePath, options, callback) => {
                            callback(null, JSON.stringify({
                                filePath,
                                options
                            }));
                        });
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then(() => {
                            sinon.assert.calledOnce(BladeConnector.blade.renderFile);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            assert.equal(renderedView, JSON.stringify({
                                filePath: 'testView',
                                options: {
                                    basedir: undefined
                                }
                            }));
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.end);
                            done();
                        });
                    });
                    describe('The response object\'s \'setHeader\' method returns false', () => {
                        beforeEach(() => {
                            response.hasHeader = sinon.fake(() => {
                                return false;
                            });
                            response.setHeader = sinon.fake();
                        });
                        it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.setHeader);
                                done();
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    describe('The response object\'s \'setHeader\' method returns true', () => {
                        beforeEach(() => {
                            response.hasHeader = sinon.fake(() => {
                                return true;
                            });
                            response.setHeader = sinon.fake();
                        });
                        it('The response object\'s \'hasHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            bladeConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.notCalled(response.setHeader);
                                done();
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('The promise have been rejected on error', () => {
                    beforeEach(() => {
                        BladeConnector.blade.renderFile = sinon.fake((filePath, options, callback) => {
                            callback(new Error());
                        });
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        bladeConnectorInstance.render('testView', {}, true).catch(() => {
                            sinon.assert.calledOnce(BladeConnector.blade.renderFile);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        bladeConnectorInstance.render('testView', {}, true).catch((renderedView) => {
                            sinon.assert.notCalled(response.end);
                            done();
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
            });
        });
    });
});