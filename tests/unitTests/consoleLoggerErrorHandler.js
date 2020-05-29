let { assert } = require('chai'),
    sinon = require('sinon');

describe('ConsoleLoggerErrorHandler', () => {
    let ConsoleLoggerErrorHandler;
    before(() => {
        ConsoleLoggerErrorHandler = require('../../index.js').errorHandler.ConsoleLoggerErrorHandler;
    });
    it('Can be loaded', () => {
        assert.isFunction(ConsoleLoggerErrorHandler);
    });
    describe('Calls \'log\' method from \'console\'', () => {
        let request,
            response,
            error,
            testIP;
        beforeEach(() => {
            console.log = sinon.fake(() => {
            });
            testIP = '127.0.0.1';
            request = {
                connection: {
                    remoteAddress: testIP
                }
            },
            response = {
                end: sinon.fake(() => {
                })
            },
            error = new Error();
            ConsoleLoggerErrorHandler.handleError(request, response, error);
        });
        it('Have been called 3 times', () => {
            sinon.assert.calledThrice(console.log);
        });
        describe('First call to \'log\' method of console', () => {
            it('Have been called with one parameter', () => {
                assert.lengthOf(console.log.getCall(0).args, 1);
            });
            it('The first parameter was a \'Date\' object', () => {
                assert.isTrue(console.log.getCall(0).args[0] instanceof Date);
            });
        });
        describe('Second call to \'log\' method of console', () => {
            it('Have been called with one parameter', () => {
                assert.lengthOf(console.log.getCall(1).args, 1);
            });
            it('The first parameter was a \'string\'', () => {
                assert.isTrue(typeof console.log.getCall(1).args[0] === 'string');
            });
        });
        describe('Third call to \'log\' method of console', () => {
            it('Have been called with one parameter', () => {
                assert.lengthOf(console.log.getCall(2).args, 1);
            });
            it('The first parameter was a \'string\'', () => {
                assert.isTrue(console.log.getCall(2).args[0] instanceof Error);
            });
            it('The first parameter was the error object which have been provided to the method as parameter', () => {
                assert.equal(console.log.getCall(2).args[0], error);
            });
        });
        afterEach(() => {
            sinon.restore();
        });
    });
    describe('Response is', () => {
        let request,
            response,
            error,
            testIP;
        beforeEach(() => {
            console.log = sinon.fake(() => {
            });
            testIP = '127.0.0.1';
            request = {
                connection: {
                    remoteAddress: testIP
                }
            },
            response = {
                end: sinon.fake(() => {
                })
            },
            error = new Error();
        });
        describe('finished', () => {
            beforeEach(() => {
                response.writeableEnded = true;
                ConsoleLoggerErrorHandler.handleError(request, response, error);
            });
            it('The \'end\' method of the \'response\' object was not called', () => {
                sinon.assert.notCalled(response.end);
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('not finished', () => {
            beforeEach(() => {
                response.writeableEnded = false;
                ConsoleLoggerErrorHandler.handleError(request, response, error);
            });
            it('The \'end\' method of the \'response\' object was called once', () => {
                sinon.assert.calledOnce(response.end);
            });
            it('The \'end\' method of the \'response\' object was called without parameters', () => {
                assert.lengthOf(response.end.getCall(0).args, 0);
            });
            it('The \'statusCode\' attribute of the \'response\' object have been set to 500', () => {
                assert.equal(response.statusCode, 500);
            });
            afterEach(() => {
                sinon.restore();
            });
        });
    });
});