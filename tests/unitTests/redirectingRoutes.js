let { assert } = require('chai'),
    sinon = require('sinon');

describe('Redirect routes', () => {
    let { WombatServer, Route, RouteService } = require('../../index.js'),
        request, response,
        defaultRoutes;
    before(() => {
        defaultRoutes = RouteService.getRoutes();
    });
    beforeEach(() => {
        request = {
            method: "GET",
            url: "",
            upgrade: false,
            headers: {},
            cookies: {}
        };
        response = {};
        response.setHeader = sinon.fake();
        response.end = sinon.spy();
    });
    describe('Redirect to URL', () => {
        before(() => {
            RouteService.setRoutes([
                Route.get('/redirecting').redirectToURL('/redirected')
            ]);
        });
        beforeEach(() => {
            request.url = '/redirecting';
            WombatServer.serveRequest(request, response);
        });
        it('Status code of response is 302', () => {
            assert.equal(response.statusCode, 302);
        });
        it('Did set location header to the right URL', () => {
            assert.equal(response.setHeader.lastArg, '/redirected');
        });
        it('Called end method of response', () => {
            sinon.assert.calledOnce(response.end);
        });
    });
    describe('Redirect to Route', () => {
        describe('Without route parameters', () => {
            before(() => {
                RouteService.setRoutes([
                    Route.get('/redirecting').redirectToRoute('redirected'),
                    Route.get('/redirectedToRoute').as('redirected')
                ]);
            });
            beforeEach(() => {
                request.url = '/redirecting';
                WombatServer.serveRequest(request, response);
            });
            it('Status code of response is 302', () => {
                assert.equal(response.statusCode, 302);
            });
            it('Did set location header to the right URL', () => {
                assert.equal(response.setHeader.lastArg, '/redirectedToRoute');
            });
            it('Called end method of response', () => {
                sinon.assert.calledOnce(response.end);
            });
            after(() => {
                RouteService.setRoutes(defaultRoutes);
            });
        });
        describe('With route parameters', () => {
            let testParameter = 'foo';
            before(() => {
                RouteService.setRoutes([
                    Route.get('/redirecting/{parameter}').redirectToRoute('redirected'),
                    Route.get('/redirectedToRoute/{parameter}').as('redirected')
                ]);
            });
            beforeEach(() => {
                request.url = '/redirecting/'+testParameter;
                request.routeVariables = {
                    parameter: testParameter
                };
                WombatServer.serveRequest(request, response);
            });
            it('Status code of response is 302', () => {
                assert.equal(response.statusCode, 302);
            });
            it('Did set location header to the right URL', () => {
                assert.equal(response.setHeader.lastArg, '/redirectedToRoute/'+testParameter);
            });
            it('Called end method of response', () => {
                sinon.assert.calledOnce(response.end);
            });
        });
    });
    afterEach(() => {
        sinon.restore();
    });
    after(() => {
        RouteService.setRoutes(defaultRoutes);
    });
});