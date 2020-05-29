let { assert } = require('chai'),
    sinon = require('sinon');

describe('DefaultErrorHandler', () => {
    let TerminalErrorHandler;
    before(() => {
        TerminalErrorHandler = require('../../index.js').errorHandler.TerminalErrorHandler;
    });
    it('Can be loaded', () => {
        assert.isFunction(TerminalErrorHandler);
    });
    describe('Calls \'end\' method from \'response\'', () => {
        let request,
            response,
            error,
            testIP;
        beforeEach(() => {
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
        it('Calls the \'end\' method from \'response\'', () => {
            try{
                TerminalErrorHandler.handleError(request, response, error);
            }
            catch (e){
                sinon.assert.calledOnce(response.end);
            }
        });
        it('Throws \'Error\' object', () => {
            assert.throws(TerminalErrorHandler.handleError);
        });
        it('Throws the Error object which was have been given to the method as a parameter', () => {
            try{
                TerminalErrorHandler.handleError(request, response, error);
            }
            catch (e){
                assert.equal(e, error);
            }
        });
        afterEach(() => {
            sinon.restore();
        });
    });
});