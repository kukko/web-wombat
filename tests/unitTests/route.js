let assert = require('chai').assert,
    sinon = require('sinon');

describe('Route', () => {
    let Route;
    before(() => {
        Route = require('../../index.js').Route;
    });
    it('Can be loaded', () => {
        assert.isFunction(Route);
    });
    describe('Have basic documented methods', () => {
        it('setRoute', () => {
            assert.isFunction(Route.prototype.setRoute);
        });
        it('getRoute', () => {
            assert.isFunction(Route.prototype.getRoute);
        });
        it('setMiddlewares', () => {
            assert.isFunction(Route.prototype.setMiddlewares);
        });
        it('getMiddlewares', () => {
            assert.isFunction(Route.prototype.getMiddlewares);
        });
        it('serve', () => {
            assert.isFunction(Route.prototype.serve);
        });
        it('serveWebSocket', () => {
            assert.isFunction(Route.prototype.serveWebSocket);
        });
        it('runController', () => {
            assert.isFunction(Route.prototype.runController);
        });
        it('runMiddlewares', () => {
            assert.isFunction(Route.prototype.runMiddlewares);
        });
        it('isMatching', () => {
            assert.isFunction(Route.prototype.isMatching);
        });
        it('urlIsMatching', () => {
            assert.isFunction(Route.prototype.urlIsMatching);
        });
        it('getRouteVariableNames', () => {
            assert.isFunction(Route.prototype.getRouteVariableNames);
        });
        it('as', () => {
            assert.isFunction(Route.prototype.as);
        });
        it('redirectToURL', () => {
            assert.isFunction(Route.prototype.redirectToURL);
        });
        it('redirectToURL', () => {
            assert.isFunction(Route.prototype.redirectToURL);
        });
        it('redirectToRoute', () => {
            assert.isFunction(Route.prototype.redirectToRoute);
        });
        it('toString', () => {
            assert.isFunction(Route.prototype.toString);
        });
    });
    describe('Have basic documented static methods', () => {
        it('get', () => {
            assert.isFunction(Route.get);
        });
        it('post', () => {
            assert.isFunction(Route.post);
        });
        it('put', () => {
            assert.isFunction(Route.post);
        });
        it('update', () => {
            assert.isFunction(Route.update);
        });
        it('delete', () => {
            assert.isFunction(Route.delete);
        });
        it('websocket', () => {
            assert.isFunction(Route.websocket);
        });
        it('resources', () => {
            assert.isFunction(Route.resources);
        });
        it('resources', () => {
            assert.isFunction(Route.resources);
        });
    });
    describe('Have basic documented static attributes', () => {
        it('routeVariableSeparators', () => {
            assert.isObject(Route.routeVariableSeparators);
        });
        it('routeVariableSeparators.start', () => {
            assert.isString(Route.routeVariableSeparators.start);
        });
        it('routeVariableSeparators.end', () => {
            assert.isString(Route.routeVariableSeparators.end);
        });
    });
    describe('Methods works as expected', () => {
        let testRoute;
        beforeEach(() => {
            testRoute = new Route;
        });
        describe('setRoute', () => {
            let testURL;
            beforeEach(() => {
                testURL = '/foo';
                testRoute.setRoute(testURL);
            });
            it('Set \'route\' attribute', () => {
                assert.equal(testRoute.route, testURL);
            });
            describe('Returns correct value', () => {
                it('Returns object', () => {
                    assert.isObject(testRoute.setRoute(testURL));
                });
                it('Returns instance of Route', () => {
                    assert.instanceOf(testRoute.setRoute(testURL), Route);
                });
                it('Returns the object itself', () => {
                    assert.equal(testRoute.setRoute(testURL), testRoute);
                });
            });
        });
        describe('getRoute', () => {
            let testURL;
            beforeEach(() => {
                testURLWithoutSlashes = 'foo';
                testURL = '/' + testURLWithoutSlashes;
                testRoute.setRoute(testURL);
            });
            describe('The \'trim\' is not given', () => {
                describe('Returns correct value', () => {
                    it('Returns string', () => {
                        assert.isString(testRoute.getRoute());
                    });
                    it('Returns the \'route\' attribute of the instance', () => {
                        assert.equal(testRoute.getRoute(), testRoute.route);
                    });
                });
            });
            describe('The \'trim\' parameter is false', () => {
                describe('Returns correct value', () => {
                    it('Returns string', () => {
                        assert.isString(testRoute.getRoute(false));
                    });
                    it('Returns the \'route\' attribute of the instance', () => {
                        assert.equal(testRoute.getRoute(false), testRoute.route);
                    });
                });
            });
            describe('The \'trim\' parameter is true', () => {
                describe('Returns correct value', () => {
                    it('Returns string', () => {
                        assert.isString(testRoute.getRoute(true));
                    });
                    it('Returns the \'route\' attribute of the instance without slashes', () => {
                        assert.equal(testRoute.getRoute(true), testURLWithoutSlashes);
                    });
                });
            });
        });
        describe('setMiddlewares', () => {
            let testMiddlewares;
            beforeEach(() => {
                testMiddlewares = [
                    {}
                ];
                testRoute.setMiddlewares(testMiddlewares);
            });
            it('Set \'middlewares\' attribute', () => {
                assert.equal(testRoute.middlewares, testMiddlewares);
            });
            describe('Returns correct value', () => {
                it('Returns object', () => {
                    assert.isObject(testRoute.setMiddlewares(testMiddlewares));
                });
                it('Returns instance of Route', () => {
                    assert.instanceOf(testRoute.setMiddlewares(testMiddlewares), Route);
                });
                it('Returns the object itself', () => {
                    assert.equal(testRoute.setMiddlewares(testMiddlewares), testRoute);
                });
            });
        });
        describe('getMiddlewares', () => {
            let testMiddlewares;
            beforeEach(() => {
                testMiddlewares = [
                    {}
                ];
                testRoute.setMiddlewares(testMiddlewares);
            });
            describe('Returns correct value', () => {
                it('Returns type of previously set middlewares', () => {
                    assert.equal(typeof testRoute.getMiddlewares(), typeof testMiddlewares);
                });
                it('Returns the previously set middlewares', () => {
                    assert.equal(testRoute.getMiddlewares(), testMiddlewares);
                });
            });
        });
    });
});