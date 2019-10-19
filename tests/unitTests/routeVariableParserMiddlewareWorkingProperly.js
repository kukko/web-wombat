let assert = require('chai').assert,
    sinon = require('sinon');
sinon.assert.expose(assert);

describe('RouteVariableParserMiddleware', () => {
    let MiddlewareProvider,
        RouteVariableParserMiddleware,
        request,
        response,
        next,
        Route;
    before(() => {
        let WebWombat = require('../../index.js');
        Route = WebWombat.Route;
        MiddlewareProvider = WebWombat.MiddlewareProvider;
        /*WombatServer.setRoutes([
            Route.get("/user"),
            Route.get("/user/{id}"),
            Route.get("/user/{id}/{operation}")
        ]);*/
    });
    beforeEach(() => {
        RouteVariableParserMiddleware = MiddlewareProvider.getMiddleware('RouteVariableParserMiddleware');
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
    describe('Route without parameters', () => {
        beforeEach(() => {
            request.url = "/user";
            request.route = Route.get("/user");
            RouteVariableParserMiddleware.run(request, response, next);
        });
        it('The routeVariables attribute of request is object', () => {
            assert.isObject(request.routeVariables);
        });
        it('The routeVariables attribute of request is empty', () => {
            assert.isEmpty(request.routeVariables);
        });
        it('Called next', () => {
            sinon.assert.calledOnce(next);
        });
    });
    describe('Route with one parameter', () => {
        let testUsername = 'wombat';
        beforeEach(() => {
            request.url = "/user/" + testUsername;
            request.route = Route.get("/user/{username}");
            RouteVariableParserMiddleware.run(request, response, next);
        });
        it('The routeVariables attribute of request is object', () => {
            assert.isObject(request.routeVariables);
        });
        it('Single routeVariable is parsed properly', () => {
            assert.equal(request.routeVariables.username, testUsername);
        });
        it('Called next', () => {
            sinon.assert.calledOnce(next);
        });
    });
    describe('Route with multiple parameter', () => {
        let testUsername = 'wombat',
            testOperation = 'update';
        beforeEach(() => {
            request.url = "/user/" + testUsername + "/" + testOperation;
            request.route = Route.get("/user/{username}/{operation}");
            RouteVariableParserMiddleware.run(request, response, next);
        });
        it('The routeVariables attribute of request is object', () => {
            assert.isObject(request.routeVariables);
        });
        it('First routeVariable is parsed properly', () => {
            assert.equal(request.routeVariables.username, testUsername);
        });
        it('Second routeVariable is parsed properly', () => {
            assert.equal(request.routeVariables.operation, testOperation);
        });
        it('Called next', () => {
            sinon.assert.calledOnce(next);
        });
    });
    describe('Parameterized route ends with fix string', () => {
        let testUsername = 'wombat';
        beforeEach(() => {
            request.url = "/user/" + testUsername + "/update";
            request.route = Route.get("/user/{username}/update");
            RouteVariableParserMiddleware.run(request, response, next);
        });
        it('The routeVariables attribute of request is object', () => {
            assert.isObject(request.routeVariables);
        });
        it('First routeVariable is parsed properly', () => {
            assert.equal(request.routeVariables.username, testUsername);
        });
        it('Called next', () => {
            sinon.assert.calledOnce(next);
        });
    });
    afterEach(() => {
        sinon.restore();
    });
});