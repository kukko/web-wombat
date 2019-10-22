let assert = require('chai').assert,
	sinon = require('sinon');
sinon.assert.expose(assert);

describe('BaseMiddleware', () => {
    let FakeMiddlewareClass;
    before(() => {
        let BaseMiddleware = require('../../index.js').BaseMiddleware;
        class FakeMiddleware extends BaseMiddleware{
        }
        FakeMiddlewareClass = FakeMiddleware;
    });
	describe('Have basic documented methods', () => {
        it('run', () => {
            assert.isFunction(FakeMiddlewareClass.run);
        });
    });
	describe('Abstract methods throws errors', () => {
        it('run throws exception', () => {
            assert.throws(FakeMiddlewareClass.run);
        });
    });
});