let { assert } = require('chai'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('FormDataParserMiddleware', () => {
    let FormDataParserMiddleware,
        request,
        response,
        next,
        data = {
            foo: 'bar'
        },
        serializedData = require('querystring').stringify(data);
    before(() => {
        let { MiddlewareProvider } = require('../../index.js');
        FormDataParserMiddleware = MiddlewareProvider.getMiddleware('FormDataParserMiddleware');
    });
    it('Can load FormDataParserMiddleware', () => {
        assert.isObject(FormDataParserMiddleware);
    });
    describe('GET requests', () => {
        before(() => {
            request = {
                ...require('events').prototype,
                method: "GET",
                url: "",
                upgrade: false,
                headers: {
                    'content-type': 'text/plain'
                }
            };
            next = sinon.fake();
            FormDataParserMiddleware.run(request, response, next);
            request.emit('data', serializedData);
            request.emit('end');
        });
        it('The method next was called', () => {
            sinon.assert.calledOnce(next);
        });
        it('The rawBody attribute have been set to the request object', () => {
            assert.equal(request.rawBody, serializedData);
        });
    });
    describe('POST requests', () => {
        let boundary,
            formData;
        before(() => {
            request = {
                ...require('events').prototype,
                method: "POST",
                url: "",
                upgrade: false,
                headers: {
                    'content-type': 'multipart/form-data; boundary=BOUNDARY',
                    'content-length': serializedData.length
                }
            };
            next = sinon.fake();
            FormDataParserMiddleware = proxyquire.load('../../src/middlewares/FormDataParserMiddleware/FormDataParserMiddleware.js', {
                'formidable': () => {
                    return {
                        parse: (requestToBePaarsed, callback) => {
                            callback(null, data, {});
                        }
                    };
                }
            });
            FormDataParserMiddleware.run(request, response, next);
            request.emit('data', serializedData);
            request.emit('end');
        });
        it('The method next was called', () => {
            sinon.assert.calledOnce(next);
        });
        it('The rawBody attribute have been set to the request object', () => {
            assert.equal(request.rawBody, serializedData);
        });
        it('Content of body parsed correctly', () => {
            assert.deepEqual(request.body, data);
        })
    });
});