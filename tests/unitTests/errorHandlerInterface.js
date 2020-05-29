let assert = require('chai').assert;

describe('ErrorHandlerInterface', () => {
    let { ErrorHandlerInterface } = require('../../index.js'),
        FakeErrorHandler;
    before(() => {
        class FakeErrorHandlerClass extends ErrorHandlerInterface{
        }
        FakeErrorHandler = FakeErrorHandlerClass;
    });
    it('Can be loaded', () => {
        assert.isFunction(ErrorHandlerInterface);
    });
    describe('Abstract methods', () => {
        it('Method \'handleError\' throws error', () => {
            assert.throws(FakeErrorHandler.handleError);
        });
    });
    describe('Methods works as expected', () => {
        describe('handleError', () => {
            it('Throws Error', () => {
                assert.throws(FakeErrorHandler.handleError);
            });
            it('Message of the thrown Error is correct', () => {
                try{
                    FakeErrorHandler.handleError()
                }
                catch (e){
                    assert.equal(e.message, "You must implement the `handleError` method in your ErrorHandler.");
                }
            });
        });
    });
});