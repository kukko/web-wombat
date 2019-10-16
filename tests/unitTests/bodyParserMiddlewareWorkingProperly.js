let assert = require('chai').assert,
	sinon = require('sinon');
sinon.assert.expose(assert);

describe('BodyParserMiddleware works expected', () => {
    let BodyParserMiddleware,
        request,
        response,
        next,
        data = {
            foo: 'bar'
        };
    before(() => {
        BodyParserMiddleware = require('../../src/middlewares/BodyParserMiddleware/BodyParserMiddleware.js');
    });
    beforeEach(() => {
		request = {
			method: "GET",
			url: "",
			upgrade: false,
            headers: {},
            rawBody: require('querystring').stringify(data)
		};
        response = {};
        next = sinon.spy();
    });
    it('Can load BodyParserMiddleware', () => {
        let { MiddlewareProvider } = require('../../index.js');
        assert.isObject(MiddlewareProvider.getMiddleware('CookieParserMiddleware'));
    });
    it('Not set body for get request', () => {
        BodyParserMiddleware.run(request, response, next);
        assert.isUndefined(request.body);
    });
    it('Parse body for POST request', () => {
        request.method = "POST";
        BodyParserMiddleware.run(request, response, next);
        assert.deepEqual(request.body, data);
    });
    it('Parse body for PUT request', () => {
        request.method = "PUT";
        BodyParserMiddleware.run(request, response, next);
        assert.deepEqual(request.body, data);
    });
    it('Parse body for UPDATE request', () => {
        request.method = "UPDATE";
        BodyParserMiddleware.run(request, response, next);
        assert.deepEqual(request.body, data);
    });
    it('Parse body for DELETE request', () => {
        request.method = "DELETE";
        BodyParserMiddleware.run(request, response, next);
        assert.deepEqual(request.body, data);
    });
    it('Called next in every situation', () => {
        BodyParserMiddleware.run(request, response, next);
        sinon.assert.calledOnce(next);
    });
});