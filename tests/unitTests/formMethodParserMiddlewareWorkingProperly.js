let assert = require('chai').assert,
	sinon = require('sinon');
sinon.assert.expose(assert);

describe('FormMethodParserMiddleware works expected', () => {
    let FormMethodParserMiddleware,
        request,
        response,
        next,
        data = {
            foo: 'bar'
        };
    before(() => {
        let { MiddlewareProvider } = require('../../index.js');
        FormMethodParserMiddleware = MiddlewareProvider.getMiddleware('FormMethodParserMiddleware');
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
    it('Can load FormMethodParserMiddleware', () => {
        assert.isObject(FormMethodParserMiddleware);
    });
    it('Parse request method from request body', () => {
        request.method = "POST";
        request.body = {
            _form_method: "PUT"
        };
        FormMethodParserMiddleware.run(request, response, next);
        assert.equal(request.method, "PUT");
    });
    it('Called next in every situation', () => {
        FormMethodParserMiddleware.run(request, response, next);
        sinon.assert.calledOnce(next);
    });
});