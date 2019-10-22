let assert = require('chai').assert,
    sinon = require('sinon');
sinon.assert.expose(assert);

describe('JwtAuthenticationMiddleware', () => {
    let JwtAuthenticationMiddleware,
        request,
        response,
        next,
        token,
        signKey,
        MiddlewareProvider;
    before(() => {
        MiddlewareProvider = require('../../index.js').MiddlewareProvider;
        let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        signKey = "";
        for (let i = 0; i < 16; i++) {
            signKey += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        token = require('jsonwebtoken').sign({
            foo: 'bar'
        }, signKey);
    });
    describe('SignKey from file', () => {
        beforeEach(() => {
            let { Config } = require('../../index.js');
            Config.GetAuth = sinon.fake(() => {
                return {
                    signKey
                };
            });
            JwtAuthenticationMiddleware = MiddlewareProvider.getMiddleware('JwtAuthenticationMiddleware');
            request = {
                method: "GET",
                url: "",
                upgrade: false,
                headers: {},
                cookies: {}
            };
            response = {};
            next = sinon.spy();
        });
        it('Can be loaded', () => {
            assert.isObject(JwtAuthenticationMiddleware);
        });
        describe('Marks request how it is authorized or not', () => {
            let data = {
                foo: 'bar'
            };
            beforeEach(() => {
                JwtAuthenticationMiddleware = MiddlewareProvider.getMiddleware('JwtAuthenticationMiddleware', {
                    return403ForUnauthenticated: false
                });
            });
            describe('No JWT is presented', () => {
                beforeEach(() => {
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Mark request as unauthorized', () => {
                    assert.equal(request.authenticated, false);
                });
                it('Called next', () => {
                    sinon.assert.calledOnce(next);
                });
            });
            describe('Invalid JWT presented', () => {
                beforeEach(() => {
                    request.cookies.jwt = "";
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Mark request as unauthorized', () => {
                    assert.equal(request.authenticated, false);
                });
                it('Called next', () => {
                    sinon.assert.calledOnce(next);
                });
            });
            describe('Valid JWT is presented', () => {
                beforeEach(() => {
                    request.cookies.jwt = token;
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Mark request as authorized', () => {
                    assert.equal(request.authenticated, true);
                });
                it('Called next', () => {
                    sinon.assert.calledOnce(next);
                });
            });
        });
        describe('Redirects unauthorized requests', () => {
            let ViewProvider,
                viewProviderGetViewFake;
            before(() => {
                ViewProvider = require('../../index.js').ViewProvider;
            });
            beforeEach(() => {
                viewProviderGetViewFake = sinon.fake();
                sinon.replace(ViewProvider.prototype, 'getView', viewProviderGetViewFake);
                JwtAuthenticationMiddleware.run(request, response, next);
                response.hasHeader = sinon.spy();
            });
            describe('When no JWT is presented', () => {
                beforeEach(() => {
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Returned view for 403 response', () => {
                    assert.equal(viewProviderGetViewFake.lastArg, '403');
                });
                it('Not called next', () => {
                    sinon.assert.notCalled(next);
                });
            });
            describe('When an invalid JWT is presented', () => {
                beforeEach(() => {
                    request.cookies = {
                        jwt: ""
                    }
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Returned view for 403 response', () => {
                    assert.equal(viewProviderGetViewFake.lastArg, '403');
                });
                it('Not called next', () => {
                    sinon.assert.notCalled(next);
                });
            });
        });
    });
    describe('SignKey from parameter', () => {
        beforeEach(() => {
            JwtAuthenticationMiddleware = MiddlewareProvider.getMiddleware('JwtAuthenticationMiddleware', {
                signKey
            });
            request = {
                method: "GET",
                url: "",
                upgrade: false,
                headers: {},
                cookies: {}
            };
            response = {};
            next = sinon.spy();
        });
        it('Can be loaded', () => {
            assert.isObject(JwtAuthenticationMiddleware);
        });
        describe('Marks request how it is authorized or not', () => {
            let data = {
                foo: 'bar'
            };
            beforeEach(() => {
                JwtAuthenticationMiddleware = MiddlewareProvider.getMiddleware('JwtAuthenticationMiddleware', {
                    signKey,
                    return403ForUnauthenticated: false
                });
            });
            describe('No JWT is presented', () => {
                beforeEach(() => {
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Mark request as unauthorized', () => {
                    assert.equal(request.authenticated, false);
                });
                it('Called next', () => {
                    sinon.assert.calledOnce(next);
                });
            });
            describe('Invalid JWT presented', () => {
                beforeEach(() => {
                    request.cookies.jwt = "";
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Mark request as unauthorized', () => {
                    assert.equal(request.authenticated, false);
                });
                it('Called next', () => {
                    sinon.assert.calledOnce(next);
                });
            });
            describe('Valid JWT is presented', () => {
                beforeEach(() => {
                    request.cookies.jwt = token;
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Mark request as authorized', () => {
                    assert.equal(request.authenticated, true);
                });
                it('Called next', () => {
                    sinon.assert.calledOnce(next);
                });
            });
        });
        describe('Redirects unauthorized requests', () => {
            let ViewProvider,
                viewProviderGetViewFake;
            before(() => {
                ViewProvider = require('../../index.js').ViewProvider;
            });
            beforeEach(() => {
                viewProviderGetViewFake = sinon.fake();
                sinon.replace(ViewProvider.prototype, 'getView', viewProviderGetViewFake);
                JwtAuthenticationMiddleware.run(request, response, next);
                response.hasHeader = sinon.spy();
            });
            describe('When no JWT is presented', () => {
                beforeEach(() => {
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Returned view for 403 response', () => {
                    assert.equal(viewProviderGetViewFake.lastArg, '403');
                });
                it('Not called next', () => {
                    sinon.assert.notCalled(next);
                });
            });
            describe('When an invalid JWT is presented', () => {
                beforeEach(() => {
                    request.cookies = {
                        jwt: ""
                    }
                    JwtAuthenticationMiddleware.run(request, response, next);
                });
                it('Returned view for 403 response', () => {
                    assert.equal(viewProviderGetViewFake.lastArg, '403');
                });
                it('Not called next', () => {
                    sinon.assert.notCalled(next);
                });
            });
        });
    });
    afterEach(() => {
        sinon.restore();
    });
});