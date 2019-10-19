let assert = require('chai').assert,
	sinon = require('sinon');
sinon.assert.expose(assert);

describe('RedirectUnauthorizedMiddleware', () => {
    let RedirectUnauthorizedMiddleware,
        MiddlewareProvider,
        next;
    before(() => {
        MiddlewareProvider = require('../../index.js').MiddlewareProvider;
    });
    beforeEach(() => {
        RedirectUnauthorizedMiddleware = MiddlewareProvider.getMiddleware('RedirectUnauthorizedMiddleware');
        next = sinon.spy();
        request = {
            method: "GET",
            url: "",
            upgrade: false,
            headers: {},
            cookies: {}
        };
        response = {
            setHeader: sinon.fake(),
            end: sinon.fake()
        };
    });
    describe('Unauthorized request', () => {
        beforeEach(() => {
            request.authenticated = false;
            RedirectUnauthorizedMiddleware.run(request, response, next);
        });
        it('Did not set status code of response', () => {
            assert.equal(response.statusCode, 302);
        });
        it('Not called setHeader method of response', () => {
            sinon.assert.calledOnce(response.setHeader);
        });
        it('Not called end method of response', () => {
            sinon.assert.calledOnce(response.end);
        });
        it('Called next', () => {
            sinon.assert.notCalled(next);
        });
        describe('Redirect', () => {
            describe('To static URL', () => {
                beforeEach(() => {
                    RedirectUnauthorizedMiddleware.run(request, response, next, {
                        ...RedirectUnauthorizedMiddleware.parameters,
                        redirectURL: "/unauthorized"
                    });
                });
                it('Relative URL', () => {
                    assert.equal(response.setHeader.lastArg, "/unauthorized");
                });
            });
            describe('To route', () => {
                let WombatServer,
                    defaultRoutes;
                before(() => {
                    let WebWombat = require('../../index.js'),
                        Route = WebWombat.Route;
                    WombatServer = WebWombat.WombatServer;
                    defaultRoutes = WombatServer.getRoutes();
                    WombatServer.setRoutes([
                        Route.get("/unauthorized").as('unauthorized')
                    ]);
                });
                beforeEach(() => {
                    RedirectUnauthorizedMiddleware.run(request, response, next, {
                        ...RedirectUnauthorizedMiddleware.parameters,
                        redirectRouteAlias: "unauthorized"
                    });
                });
                it('Relative URL', () => {
                    assert.equal(response.setHeader.lastArg, "/unauthorized");
                });
                after(() => {
                    WombatServer.setRoutes(defaultRoutes);
                });
            });
        });
    });
    describe('Authorized request', () => {
        beforeEach(() => {
            request.authenticated = true;
            RedirectUnauthorizedMiddleware.run(request, response, next);
        });
        it('Did not set status code of response', () => {
            assert.isUndefined(response.statusCode);
        });
        it('Not called setHeader method of response', () => {
            sinon.assert.notCalled(response.setHeader);
        });
        it('Not called end method of response', () => {
            sinon.assert.notCalled(response.end);
        });
        it('Called next', () => {
            sinon.assert.calledOnce(next);
        });
    });
    afterEach(() => {
        sinon.restore();
    });
});