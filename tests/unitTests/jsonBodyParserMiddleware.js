let { assert } = require('chai'),
    sinon = require('sinon');

describe('JsonBodyParserMiddleware', () => {
    let JsonBodyParserMiddleware,
        request,
        response,
        next,
        data = {
            foo: 'bar'
        },
        serializedData = require('querystring').stringify(data);
    before(() => {
        let { MiddlewareProvider } = require('../../index.js');
        JsonBodyParserMiddleware = MiddlewareProvider.getMiddleware('JsonBodyParserMiddleware');
    });
    it('Can load JsonBodyParserMiddleware', () => {
        assert.isObject(JsonBodyParserMiddleware);
    });
    describe('GET requests', () => {
        before(() => {
            request = {
                method: "GET",
                url: "",
                upgrade: false,
                headers: {}
            };
            next = sinon.fake();
            sinon.spy(JSON, 'parse');
            JsonBodyParserMiddleware.run(request, response, next);
        });
        it('The method next was called', () => {
            sinon.assert.calledOnce(next);
        });
        it('The parse method from JSON class was not called', () => {
            sinon.assert.notCalled(JSON.parse);
        });
        it('The body attribute haven\'t been set to the request object', () => {
            assert.isUndefined(request.body);
        });
        after(() => {
            sinon.restore();
        });
    });
    describe('POST requests', () => {
        let data;
        before(() => {
            data = {
                foo: 'bar'
            };
            request = {
                method: "POST",
                url: "",
                upgrade: false,
                headers: {
                    'content-type': 'application/json;'
                },
                rawBody: JSON.stringify(data)
            };
            next = sinon.fake();
            sinon.spy(JSON, 'parse');
            JsonBodyParserMiddleware.run(request, response, next);
        });
        it('The method next was called', () => {
            sinon.assert.calledOnce(next);
        });
        it('The parse method from JSON class was called', () => {
            sinon.assert.calledOnce(JSON.parse);
        });
        it('The body attribute have been set to the request object', () => {
            assert.isObject(request.body);
        });
        it('The body have been parsed correctly', () => {
            assert.deepEqual(request.body, data);
        });
        after(() => {
            sinon.restore();
        });
    });
});