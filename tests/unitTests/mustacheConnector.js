let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('MustacheConnector', function() {
    let MustacheConnector,
        mustacheConnectorInstance,
        request = {},
        response = {};
    before(() => {
        MustacheConnector = require('../../index.js').templateConnectors.MustacheConnector;
    });
    it('Can load MustacheConnector', () => {
        assert.isFunction(MustacheConnector);
    });
    it('MustacheConnector loaded mustache module', () => {
        assert.isObject(MustacheConnector.mustache);
    });
    it('The \'viewFolder\' attribute is undefined', () => {
        assert.isUndefined(MustacheConnector.viewFolder);
    });
    describe('It can be instantiated properly', () => {
        before(() => {
            mustacheConnectorInstance = new MustacheConnector(request, response);
        });
        it('Object have been instantated', () => {
            assert.isObject(mustacheConnectorInstance);
        });
        it('The \'request\' attribute have been set', () => {
            assert.equal(mustacheConnectorInstance.request, request);
        });
        it('The \'response\' attribute have been set', () => {
            assert.equal(mustacheConnectorInstance.response, response);
        });
    });
    describe('Methods works as expected', () => {
        before(() => {
            MustacheConnector = proxyquire.load('../../src/TemplateConnectors/MustacheConnector/MustacheConnector.js', {
                'fs': {
                    'readFileSync': (filePath, encoding) => {
                        return filePath;
                    }
                }
            });
            mustacheConnectorInstance = new MustacheConnector(request, response);
        });
        it('getDefaultFileExtension', () => {
            assert.equal(mustacheConnectorInstance.getDefaultFileExtension(), '.mst');
        })
        describe('render', () => {
            describe('Called with default parameters', () => {
                beforeEach(() => {
                    MustacheConnector.mustache.render = sinon.fake((filePath, options) => {
                        return JSON.stringify({
                            filePath,
                            options
                        });
                    });
                    response.hasHeader = sinon.fake(() => {
                        return false;
                    });
                    response.setHeader = sinon.fake();
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'render\' method have been called from mustache', (done) => {
                    mustacheConnectorInstance.render('testView', {}).then(() => {
                        sinon.assert.calledOnce(MustacheConnector.mustache.render);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    mustacheConnectorInstance.render('testView', {}).then((renderedView) => {
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
                    mustacheConnectorInstance.render('testView', {}).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    mustacheConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        mustacheConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        mustacheConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}).then((renderedView) => {
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
                    MustacheConnector.mustache.render = sinon.fake((filePath, options) => {
                        return JSON.stringify({
                            filePath,
                            options
                        });
                    });
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'renderFile\' method have been called from mustache', (done) => {
                    mustacheConnectorInstance.render('testView', {}, false).then(() => {
                        sinon.assert.calledOnce(MustacheConnector.mustache.render);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    mustacheConnectorInstance.render('testView', {}, false).then((renderedView) => {
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
                    mustacheConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    mustacheConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
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
                        mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        MustacheConnector.mustache.render = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        mustacheConnectorInstance.render('testView', {}, false, false).catch(() => {
                            sinon.assert.calledOnce(MustacheConnector.mustache.render);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
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
                        MustacheConnector.mustache.render = sinon.fake((filePath, options) => {
                            return JSON.stringify({
                                filePath,
                                options
                            });
                        });
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, false).then(() => {
                            sinon.assert.calledOnce(MustacheConnector.mustache.render);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
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
                        mustacheConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            sinon.assert.calledOnce(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
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
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        MustacheConnector.mustache.render = sinon.fake((filePath, options) => {
                            return JSON.stringify({
                                filePath,
                                options
                            });
                        });
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, true).then(() => {
                            sinon.assert.calledOnce(MustacheConnector.mustache.render);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            mustacheConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        MustacheConnector.mustache.render = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                    });
                    it('The \'renderFile\' method have been called from mustache', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true).catch(() => {
                            sinon.assert.calledOnce(MustacheConnector.mustache.render);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        mustacheConnectorInstance.render('testView', {}, true).catch((renderedView) => {
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