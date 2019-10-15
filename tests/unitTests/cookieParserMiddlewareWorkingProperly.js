let assert = require('chai').assert,
	sinon = require('sinon');
sinon.assert.expose(assert);

describe('CookieParserMiddleware works expected', () => {
    let CookieParserMiddleware,
        request,
        response,
        next,
        data = {
            foo: 'bar'
        };
    before(() => {
        CookieParserMiddleware = require('../../src/middlewares/CookieParserMiddleware/CookieParserMiddleware.js');
    });
    beforeEach(() => {
		request = {
			method: "GET",
			url: "",
			upgrade: false,
            headers: {}
		};
        response = {};
        next = sinon.spy();
    });
    it('The cookies attribute setted for request object when no cookies setted', () => {
        CookieParserMiddleware.run(request, response, next);
        assert.deepEqual(request.cookies, {});
    });
    it('Cookies parsed properly', () => {
        let data = {
            foo: 'bar'
        };
        request.headers.cookie = require('querystring').stringify(data);
        CookieParserMiddleware.run(request, response, next);
        assert.deepEqual(request.cookies, data);
    });
    it('Called next in every situation', () => {
        CookieParserMiddleware.run(request, response, next);
        sinon.assert.calledOnce(next);
    });
});