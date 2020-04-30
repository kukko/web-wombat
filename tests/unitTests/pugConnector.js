let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('PugConnector', () => {
    let PugConnector,
        pugConnectorInstance,
        request = {},
        response = {};
    before(() => {
        PugConnector = require('../../index.js').templateConnectors.PugConnector;
    });
    it('Can load PugConnector', () => {
        assert.isFunction(PugConnector);
    });
    it('PugConnector loaded pug module', () => {
        assert.isObject(PugConnector.pug);
    });
    it('The \'viewFolder\' attribute is undefined', () => {
        assert.isUndefined(PugConnector.viewFolder);
    });
    describe('It can be instantiated properly', () => {
        before(() => {
            pugConnectorInstance = new PugConnector(request, response);
        });
        it('Object have been instantated', () => {
            assert.isObject(pugConnectorInstance);
        });
        it('The \'request\' attribute have been set', () => {
            assert.equal(pugConnectorInstance.request, request);
        });
        it('The \'response\' attribute have been set', () => {
            assert.equal(pugConnectorInstance.response, response);
        });
    });
    describe('Methods works as expected', () => {
        before(() => {
            pugConnectorInstance = new PugConnector(request, response);
        });
        it('getDefaultFileExtension', () => {
            assert.equal(pugConnectorInstance.getDefaultFileExtension(), '.pug');
        })
        describe('render', () => {
            describe('Called with default parameters', () => {
                beforeEach(() => {
                    PugConnector.pug.renderFile = sinon.fake((filePath, options) => {
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
                it('The \'renderFile\' method have been called from pug', (done) => {
                    pugConnectorInstance.render('testView', {}).then(() => {
                        sinon.assert.calledOnce(PugConnector.pug.renderFile);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    pugConnectorInstance.render('testView', {}).then((renderedView) => {
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
                    pugConnectorInstance.render('testView', {}).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    pugConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        pugConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        pugConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}).then((renderedView) => {
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
                    PugConnector.pug.renderFile = sinon.fake((filePath, options) => {
                        return JSON.stringify({
                            filePath,
                            options
                        });
                    });
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'renderFile\' method have been called from pug', (done) => {
                    pugConnectorInstance.render('testView', {}, false).then(() => {
                        sinon.assert.calledOnce(PugConnector.pug.renderFile);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    pugConnectorInstance.render('testView', {}, false).then((renderedView) => {
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
                    pugConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    pugConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
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
                        pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        PugConnector.pug.renderFile = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                    });
                    it('The \'renderFile\' method have been called from pug', (done) => {
                        pugConnectorInstance.render('testView', {}, false, false).catch(() => {
                            sinon.assert.calledOnce(PugConnector.pug.renderFile);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
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
                        PugConnector.pug.renderFile = sinon.fake((filePath, options) => {
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
                    it('The \'renderFile\' method have been called from pug', (done) => {
                        pugConnectorInstance.render('testView', {}, true, false).then(() => {
                            sinon.assert.calledOnce(PugConnector.pug.renderFile);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        pugConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
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
                        pugConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            sinon.assert.calledOnce(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
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
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        PugConnector.pug.renderFile = sinon.fake((filePath, options) => {
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
                    it('The \'renderFile\' method have been called from pug', (done) => {
                        pugConnectorInstance.render('testView', {}, true, true).then(() => {
                            sinon.assert.calledOnce(PugConnector.pug.renderFile);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            pugConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        PugConnector.pug.renderFile = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                    });
                    it('The \'renderFile\' method have been called from pug', (done) => {
                        pugConnectorInstance.render('testView', {}, true).catch(() => {
                            sinon.assert.calledOnce(PugConnector.pug.renderFile);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, true).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        pugConnectorInstance.render('testView', {}, true).catch((renderedView) => {
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