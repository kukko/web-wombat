let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('HandlebarsConnector', function() {
    let HandlebarsConnector,
        handlebarsConnectorInstance,
        request = {},
        response = {};
    before(() => {
        HandlebarsConnector = require('../../index.js').templateConnectors.HandlebarsConnector;
    });
    it('Can load HandlebarsConnector', () => {
        assert.isFunction(HandlebarsConnector);
    });
    it('HandlebarsConnector loaded handlebars module', () => {
        assert.isObject(HandlebarsConnector.handlebars);
    });
    it('The \'viewFolder\' attribute is undefined', () => {
        assert.isUndefined(HandlebarsConnector.viewFolder);
    });
    describe('It can be instantiated properly', () => {
        before(() => {
            handlebarsConnectorInstance = new HandlebarsConnector(request, response);
        });
        it('Object have been instantated', () => {
            assert.isObject(handlebarsConnectorInstance);
        });
        it('The \'request\' attribute have been set', () => {
            assert.equal(handlebarsConnectorInstance.request, request);
        });
        it('The \'response\' attribute have been set', () => {
            assert.equal(handlebarsConnectorInstance.response, response);
        });
    });
    describe('Methods works as expected', () => {
        before(() => {
            HandlebarsConnector = proxyquire.load('../../src/TemplateConnectors/HandlebarsConnector/HandlebarsConnector.js', {
                'fs': {
                    'readFileSync': (filePath, encoding) => {
                        return filePath;
                    }
                }
            });
            handlebarsConnectorInstance = new HandlebarsConnector(request, response);
        });
        it('getDefaultFileExtension', () => {
            assert.equal(handlebarsConnectorInstance.getDefaultFileExtension(), '.handlebars');
        })
        describe('render', () => {
            describe('Called with default parameters', () => {
                beforeEach(() => {
                    HandlebarsConnector.handlebars.compile = sinon.fake((filePath) => {
                        return (options) => {
                            return JSON.stringify({
                                filePath,
                                options
                            });
                        }
                    });
                    response.hasHeader = sinon.fake(() => {
                        return false;
                    });
                    response.setHeader = sinon.fake();
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'compile\' method have been called from handlebars', (done) => {
                    handlebarsConnectorInstance.render('testView', {}).then(() => {
                        sinon.assert.calledOnce(HandlebarsConnector.handlebars.compile);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    handlebarsConnectorInstance.render('testView', {}).then((renderedView) => {
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
                    handlebarsConnectorInstance.render('testView', {}).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    handlebarsConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        handlebarsConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        handlebarsConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}).then((renderedView) => {
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
                    HandlebarsConnector.handlebars.compile = sinon.fake((filePath) => {
                        return (options) => {
                            return JSON.stringify({
                                filePath,
                                options
                            });
                        };
                    });
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'compile\' method have been called from handlebars', (done) => {
                    handlebarsConnectorInstance.render('testView', {}, false).then(() => {
                        sinon.assert.calledOnce(HandlebarsConnector.handlebars.compile);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    handlebarsConnectorInstance.render('testView', {}, false).then((renderedView) => {
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
                    handlebarsConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    handlebarsConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
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
                        handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        HandlebarsConnector.handlebars.compile = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                    });
                    it('The \'compile\' method have been called from handlebars', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, false, false).catch(() => {
                            sinon.assert.calledOnce(HandlebarsConnector.handlebars.compile);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
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
                        HandlebarsConnector.handlebars.compile = sinon.fake((filePath) => {
                            return (options) => {
                                return JSON.stringify({
                                    filePath,
                                    options
                                });
                            };
                        });
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'compile\' method have been called from handlebars', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, false).then(() => {
                            sinon.assert.calledOnce(HandlebarsConnector.handlebars.compile);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
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
                        handlebarsConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            sinon.assert.calledOnce(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
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
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        HandlebarsConnector.handlebars.compile = sinon.fake((filePath) => {
                            return (options) => {
                                return JSON.stringify({
                                    filePath,
                                    options
                                });
                            };
                        });
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'compile\' method have been called from handlebars', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, true).then(() => {
                            sinon.assert.calledOnce(HandlebarsConnector.handlebars.compile);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            handlebarsConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        HandlebarsConnector.handlebars.compile = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                    });
                    it('The \'compile\' method have been called from handlebars', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true).catch(() => {
                            sinon.assert.calledOnce(HandlebarsConnector.handlebars.compile);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        handlebarsConnectorInstance.render('testView', {}, true).catch((renderedView) => {
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