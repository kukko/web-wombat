let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('HTMLConnector', function() {
    let HTMLConnector,
        htmlConnectorInstance,
        request = {},
        response = {};
    before(() => {
        HTMLConnector = require('../../index.js').templateConnectors.HTMLConnector;
    });
    it('Can load HTMLConnector', () => {
        assert.isFunction(HTMLConnector);
    });
    it('HTMLConnector loaded readFileSync function from fs module', () => {
        assert.isFunction(HTMLConnector.readFileSync);
    });
    it('The \'viewFolder\' attribute is undefined', () => {
        assert.isUndefined(HTMLConnector.viewFolder);
    });
    describe('It can be instantiated properly', () => {
        before(() => {
            htmlConnectorInstance = new HTMLConnector(request, response);
        });
        it('Object have been instantated', () => {
            assert.isObject(htmlConnectorInstance);
        });
        it('The \'request\' attribute have been set', () => {
            assert.equal(htmlConnectorInstance.request, request);
        });
        it('The \'response\' attribute have been set', () => {
            assert.equal(htmlConnectorInstance.response, response);
        });
    });
    describe('Methods works as expected', () => {
        let readFileSyncFake;
        beforeEach(() => {
            readFileSyncFake = sinon.fake((filePath, encoding) => {
                return filePath;
            });
            HTMLConnector = proxyquire.load('../../src/TemplateConnectors/HTMLConnector/HTMLConnector.js', {
                'fs': {
                    'readFileSync': readFileSyncFake
                }
            });
            htmlConnectorInstance = new HTMLConnector(request, response);
        });
        it('getDefaultFileExtension', () => {
            assert.equal(htmlConnectorInstance.getDefaultFileExtension(), '.html');
        })
        describe('render', () => {
            describe('Called with default parameters', () => {
                beforeEach(() => {
                    response.hasHeader = sinon.fake(() => {
                        return false;
                    });
                    response.setHeader = sinon.fake();
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'readFileSync\' method have been called from fs module', (done) => {
                    htmlConnectorInstance.render('testView', {}).then(() => {
                        sinon.assert.calledOnce(readFileSyncFake);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    htmlConnectorInstance.render('testView', {}).then((renderedView) => {
                        assert.equal(renderedView, 'testView');
                        done();
                    });
                });
                it('The response object\'s \'write\' method wasn\'t called', (done) => {
                    htmlConnectorInstance.render('testView', {}).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    htmlConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        htmlConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}).then((renderedView) => {
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
                        htmlConnectorInstance.render('testView', {}).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}).then((renderedView) => {
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
                    response.write = sinon.fake();
                    response.end = sinon.fake();
                });
                it('The \'readFileSync\' method have been called from fs module', (done) => {
                    htmlConnectorInstance.render('testView', {}, false).then(() => {
                        sinon.assert.calledOnce(readFileSyncFake);
                        done();
                    });
                });
                it('Resolves correct value', (done) => {
                    htmlConnectorInstance.render('testView', {}, false).then((renderedView) => {
                        assert.equal(renderedView, 'testView');
                        done();
                    });
                });
                it('The response object\'s \'write\' method wasn\'t called', (done) => {
                    htmlConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
                        sinon.assert.notCalled(response.write);
                        done();
                    });
                });
                it('The response object\'s \'end\' method wasn\'t called', (done) => {
                    htmlConnectorInstance.render('testView', {}, false, false).then((renderedView) => {
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
                        htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.calledOnce(response.hasHeader);
                            done();
                        });
                    });
                    it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        readFileSyncFake = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                        HTMLConnector = proxyquire.load('../../src/TemplateConnectors/HTMLConnector/HTMLConnector.js', {
                            'fs': {
                                'readFileSync': readFileSyncFake
                            }
                        });
                        htmlConnectorInstance = new HTMLConnector(request, response);
                    });
                    it('The \'readFileSync\' method have been called from fs module', (done) => {
                        htmlConnectorInstance.render('testView', {}, false, false).catch((e) => {
                            sinon.assert.calledOnce(readFileSyncFake);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, false, false).catch((renderedView) => {
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
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'readFileSync\' method have been called from fs module', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, false).then(() => {
                            sinon.assert.calledOnce(readFileSyncFake);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            assert.equal(renderedView, 'testView');
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
                            sinon.assert.calledOnce(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, false).then((renderedView) => {
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
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        response.hasHeader = sinon.fake(() => {
                            return false;
                        });
                        response.setHeader = sinon.fake();
                    });
                    it('The \'readFileSync\' method have been called from fs module', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, true).then(() => {
                            sinon.assert.calledOnce(readFileSyncFake);
                            done();
                        });
                    });
                    it('Resolves correct value', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            assert.equal(renderedView, 'testView');
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
                                sinon.assert.calledOnce(response.hasHeader);
                                done();
                            });
                        });
                        it('The response object\'s \'setHeader\' method wasn\'t called', (done) => {
                            htmlConnectorInstance.render('testView', {}, true, true).then((renderedView) => {
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
                        readFileSyncFake = sinon.fake((filePath, options) => {
                            throw new Error();
                        });
                        HTMLConnector = proxyquire.load('../../src/TemplateConnectors/HTMLConnector/HTMLConnector.js', {
                            'fs': {
                                'readFileSync': readFileSyncFake
                            }
                        });
                        htmlConnectorInstance = new HTMLConnector(request, response);
                    });
                    it('The \'readFileSync\' method have been called from fs module', (done) => {
                        htmlConnectorInstance.render('testView', {}, true).catch(() => {
                            sinon.assert.calledOnce(readFileSyncFake);
                            done();
                        });
                    });
                    it('The response object\'s \'write\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true).catch((renderedView) => {
                            sinon.assert.notCalled(response.write);
                            done();
                        });
                    });
                    it('The response object\'s \'end\' method wasn\'t called', (done) => {
                        htmlConnectorInstance.render('testView', {}, true).catch((renderedView) => {
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