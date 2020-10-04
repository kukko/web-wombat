let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

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
            Route = proxyquire.load('../../src/Route', {
                './services/SessionService/SessionService.js': {}
            });
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
        describe('serve', () => {
            let testRoute,
                testResponseBody,
                testRequest,
                testResponse,
                testRedirectRouteAlias,
                testRedirectURL;
            beforeEach(() => {
                testRedirectRouteAlias = 'redirectURL';
                testRedirectURL = '/redirectURL'
                Route = proxyquire.load('../../src/Route.js', {
                    './services/ServiceProvider.js': {
                        getRouteService: () => {
                            return {
                                getRouteByAlias: () => {
                                    return testRedirectURL;
                                }
                            };
                        }
                    }
                });
                testRoute = new Route('/', 'GET', {});
                previousRunController = Route.runController;
                testResponseBody = 'foo';
                testRoute.runController = sinon.fake(() => {
                    return testResponseBody;
                });
                testRequest = {};
                testResponse = {
                    setHeader: sinon.fake(() => {
                    }),
                    end: sinon.fake(() => {
                    })
                };
            });
            describe('Returns correct value', () => {
                describe('When route not redirects', () => {
                    it('Returns string', () => {
                        assert.isString(testRoute.serve());
                    });
                    it('Returned string is correct', () => {
                        assert.equal(testRoute.serve(), testResponseBody);
                    });
                });
                describe('When route redirects', () => {
                    beforeEach(() => {
                        testRoute.redirectRouteAlias = testRedirectRouteAlias;
                        testRoute.serve(testRequest, testResponse);
                    });
                    it('Returns \'undefined\' value', () => {
                        assert.isUndefined(testRoute.serve(testRequest, testResponse));
                    });
                    it('The \'setHeader\' method of response have been called', () => {
                        sinon.assert.calledOnce(testResponse.setHeader);
                    });
                    it('The response\'s \'setHeader\' method have been called with correct parameters', () => {
                        assert.deepEqual(testResponse.setHeader.getCall(0).args, [
                            'Location',
                            testRedirectURL
                        ]);
                    });
                    it('The \'end\' method of response have been called', () => {
                        sinon.assert.calledOnce(testResponse.end);
                    });
                    it('The response\'s \'end\' method have been called with correct parameters', () => {
                        assert.deepEqual(testResponse.end.getCall(0).args, [
                        ]);
                    });
                });
            });
        });
        describe('serveWebSocket', () => {
            let WebSocketController,
                FakeWebSocketController,
                testRoute,
                previouesHandshake,
                testRequest,
                testResponse,
                testHead;
            beforeEach(() => {
                WebSocketController = require('../../index.js').WebSocketController;
                previouesHandshake = WebSocketController.prototype.handshake;
                WebSocketController.prototype.handshake = sinon.fake(() => {
                });
                class FakeWebSocketControllerClass extends WebSocketController{
                }
                FakeWebSocketController = FakeWebSocketControllerClass;
                testRoute = new Route('/', 'GET', FakeWebSocketController);
                testRequest = {};
                testResponse = {
                    on: sinon.fake(() => {
                    })
                },
                testHead = {};
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(testRoute.serveWebSocket(testRequest, testResponse, testHead));
                });
            });
            describe('Instantiates controller', () => {
                let fakeConstructor;
                beforeEach(() => {
                    fakeConstructor = sinon.fake(() => {
                    });
                    class FakeWebSocketControllerClass extends WebSocketController{
                        constructor(){
                            fakeConstructor();
                            return {};
                        }
                    }
                    FakeWebSocketController = FakeWebSocketControllerClass;
                    testRoute = new Route('/', 'GET', FakeWebSocketController);
                    testRoute.serveWebSocket(testRequest, testResponse, testHead);
                });
                it('Constructor called', () => {
                    sinon.assert.calledOnce(fakeConstructor);
                });
            });
            afterEach(() => {
                WebSocketController.prototype.handshake = previouesHandshake;
            });
        });
        describe('runController', () => {
            let testController,
                testRoute,
                fakeControllerAllMiddlewares,
                testControllerMiddlewares,
                testRouteMiddlewares,
                testRequest,
                testResponse;
            beforeEach(() => {
                let BaseController = require('../../index.js').BaseController;
                fakeControllerAllMiddlewares = sinon.fake(() => {
                });
                testControllerMiddlewares = [
                ];
                testRouteMiddlewares = [
                ];
                class testControllerClass extends BaseController{
                    static get allMiddlewares(){
                        fakeControllerAllMiddlewares();
                        return testControllerMiddlewares;
                    }
                }
                testController = testControllerClass;
                testRoute = new Route('/', 'GET', testController);
                testRoute.runMiddlewares = sinon.fake(() => {
                });
                testRoute.getMiddlewares = sinon.fake(() => {
                    return testRouteMiddlewares;
                });
                testRequest = {};
                testResponse = {};
            });
            describe('Calls methods', () => {
                it('Gets middlewares of controller', () => {
                    testRoute.runController(testRequest, testResponse);
                    sinon.assert.calledOnce(fakeControllerAllMiddlewares);
                });
                describe('Calls \'runMiddlewares\' method', () => {
                    describe('Controller middlewares are not empty', () => {
                        beforeEach(() => {
                            testControllerMiddlewares = [
                                {
                                    name: 'foo'
                                },
                                {
                                    name: 'bar'
                                }
                            ];
                            testRouteMiddlewares = [
                                {
                                    name: 'foobar'
                                }
                            ];
                            testRoute.runController(testRequest, testResponse);
                        });
                        it('Have been called once', () => {
                            sinon.assert.calledOnce(testRoute.runMiddlewares);
                        });
                        it('Have been called with correct values', () => {
                            assert.deepEqual(testRoute.runMiddlewares.getCall(0).args, [
                                testRequest,
                                testResponse,
                                [
                                    ...testControllerMiddlewares,
                                    ...testRouteMiddlewares
                                ]
                            ]);
                        });
                    });
                    describe('Controller middlewares are empty', () => {
                        beforeEach(() => {
                            testController = class {
                            };
                            testRoute = new Route('/', 'GET', testController);
                            testRoute.runMiddlewares = sinon.fake(() => {
                            });
                            testRoute.getMiddlewares = sinon.fake(() => {
                                return testRouteMiddlewares;
                            });
                            testRouteMiddlewares = [
                                {
                                    name: 'foobar'
                                }
                            ];
                            testRoute.runController(testRequest, testResponse);
                        });
                        it('Have been called once', () => {
                            sinon.assert.calledOnce(testRoute.runMiddlewares);
                        });
                        it('Have been called with correct values', () => {
                            assert.deepEqual(testRoute.runMiddlewares.getCall(0).args, [
                                testRequest,
                                testResponse,
                                [
                                    ...testRouteMiddlewares
                                ]
                            ]);
                        });
                    });
                });
            });
        });
        describe('runMiddlewares', () => {
            let testRoute,
                fakeController,
                testRequest,
                testResponse,
                testMiddlewares,
                fakeControllerConstructor,
                fakeControllerServe,
                fakeControllerSetRouteAliasBase,
                fakeIsWithSessions,
                fakeIsWithSessionsReturnValue,
                fakeSessionStarted,
                fakeSessionStartedReturnValue,
                fakeStartSession;
            beforeEach(() => {
                let { BaseController, BaseMiddleware } = require('../../index.js');
                fakeControllerConstructor = sinon.fake(() => {
                });
                fakeControllerServe = sinon.fake(() => {
                });
                fakeControllerSetRouteAliasBase = sinon.fake(() => {
                });
                testRequest = {};
                testResponse = {};
                fakeIsWithSessions = sinon.fake(() => {
                    return fakeIsWithSessionsReturnValue;
                });
                fakeSessionStarted = sinon.fake(() => {
                    return fakeSessionStartedReturnValue;
                });
                fakeStartSession = sinon.fake(() => {
                });
                Route = proxyquire.load('../../src/Route.js', {
                    './services/ServiceProvider.js': {
                        getSessionService: () => {
                            return {
                                isWithSessions: fakeIsWithSessions,
                                sessionStarted: fakeSessionStarted,
                                startSession: fakeStartSession
                            };
                        }
                    }
                });
            });
            describe('Middlewares are empty', () => {
                beforeEach(() => {
                    testMiddlewares = [
                    ];
                });
                describe('Controller is BaseController', () => {
                    beforeEach(() => {
                        let { BaseController } = require('../../index.js');
                        class FakeControllerClass extends BaseController{
                            constructor(...parameters){
                                fakeControllerConstructor(...parameters);
                                return FakeControllerClass.prototype;
                            }
                        }
                        FakeControllerClass.prototype.serve = fakeControllerServe;
                        fakeController = FakeControllerClass;
                        testRoute = new Route('/', 'GET', fakeController);
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'undefined\' value', () => {
                            assert.isUndefined(testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares));
                        });
                    });
                    describe('Calls methods', () => {
                        describe('The \'isWithSessions\' method of \'SessionService\' class returns false', () => {
                            beforeEach(() => {
                                fakeIsWithSessionsReturnValue = false;
                            });
                            describe('The \'sessionStarted\' method of \'SessionService\' class returns false', () => {
                                beforeEach(() => {
                                    fakeSessionStartedReturnValue = false;
                                    testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares);
                                });
                                describe('Instantiates Controller', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerConstructor);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerConstructor, testRequest, testResponse);
                                    });
                                });
                                describe('Calls controller\'s setRouteAliasBase method', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeControllerSetRouteAliasBase);
                                    });
                                });
                                describe('Calls controller\'s serve method', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerServe);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerServe, testRequest, testResponse);
                                    });
                                });
                                describe('Calls \'isWithSessions\' method of \'SessionService\' class', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeIsWithSessions);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeIsWithSessions);
                                    });
                                });
                                describe('Calls \'sessionStarted\' method of \'SessionService\' class', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeSessionStarted);
                                    });
                                });
                                describe('Calls \'startSession\' method of \'SessionService\' class', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeStartSession);
                                    });
                                });
                            });
                            describe('The \'sessionStarted\' method of \'SessionService\' class returns true', () => {
                                beforeEach(() => {
                                    fakeSessionStartedReturnValue = true;
                                    testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares);
                                });
                                describe('Instantiates Controller', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerConstructor);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerConstructor, testRequest, testResponse);
                                    });
                                });
                                describe('Calls controller\'s setRouteAliasBase method', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeControllerSetRouteAliasBase);
                                    });
                                });
                                describe('Calls controller\'s serve method', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerServe);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerServe, testRequest, testResponse);
                                    });
                                });
                                describe('Calls \'isWithSessions\' method of \'SessionService\' class', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeIsWithSessions);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeIsWithSessions);
                                    });
                                });
                                describe('Calls \'sessionStarted\' method of \'SessionService\' class', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeSessionStarted);
                                    });
                                });
                                describe('Calls \'startSession\' method of \'SessionService\' class', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeStartSession);
                                    });
                                });
                            });
                        });
                        describe('The \'isWithSessions\' method of \'SessionService\' class returns false', () => {
                            beforeEach(() => {
                                fakeIsWithSessionsReturnValue = true;
                            });
                            describe('The \'sessionStarted\' method of \'SessionService\' class returns false', () => {
                                beforeEach(() => {
                                    fakeSessionStartedReturnValue = false;
                                    testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares);
                                });
                                describe('Instantiates Controller', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerConstructor);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerConstructor, testRequest, testResponse);
                                    });
                                });
                                describe('Calls controller\'s setRouteAliasBase method', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeControllerSetRouteAliasBase);
                                    });
                                });
                                describe('Calls controller\'s serve method', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerServe);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerServe, testRequest, testResponse);
                                    });
                                });
                                describe('Calls \'isWithSessions\' method of \'SessionService\' class', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeIsWithSessions);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeIsWithSessions);
                                    });
                                });
                                describe('Calls \'sessionStarted\' method of \'SessionService\' class', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeSessionStarted);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeSessionStarted, testRequest);
                                    });
                                });
                                describe('Calls \'startSession\' method of \'SessionService\' class', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeStartSession);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeStartSession, testRequest, testResponse);
                                    });
                                });
                            });
                            describe('The \'sessionStarted\' method of \'SessionService\' class returns true', () => {
                                beforeEach(() => {
                                    fakeSessionStartedReturnValue = true;
                                    testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares);
                                });
                                describe('Instantiates Controller', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerConstructor);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerConstructor, testRequest, testResponse);
                                    });
                                });
                                describe('Calls controller\'s setRouteAliasBase method', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeControllerSetRouteAliasBase);
                                    });
                                });
                                describe('Calls controller\'s serve method', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeControllerServe);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeControllerServe, testRequest, testResponse);
                                    });
                                });
                                describe('Calls \'isWithSessions\' method of \'SessionService\' class', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeIsWithSessions);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeIsWithSessions);
                                    });
                                });
                                describe('Calls \'sessionStarted\' method of \'SessionService\' class', () => {
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(fakeSessionStarted);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(fakeSessionStarted, testRequest);
                                    });
                                });
                                describe('Calls \'startSession\' method of \'SessionService\' class', () => {
                                    it('Not called', () => {
                                        sinon.assert.notCalled(fakeStartSession);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('Controller is ResourceController', () => {
                    beforeEach(() => {
                        let { ResourceController } = require('../../index.js');
                        class FakeControllerClass extends ResourceController{
                            constructor(...parameters){
                                fakeControllerConstructor(...parameters);
                                return FakeControllerClass.prototype;
                            }
                        }
                        FakeControllerClass.prototype.serve = fakeControllerServe;
                        FakeControllerClass.prototype.setRouteAliasBase = fakeControllerSetRouteAliasBase;
                        fakeController = FakeControllerClass;
                        testRoute = new Route('/', 'GET', fakeController);
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'undefined\' value', () => {
                            assert.isUndefined(testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares));
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares);
                        });
                        it('instantiates Controller', () => {
                            sinon.assert.calledOnce(fakeControllerConstructor);
                        });
                        it('Calls controller\'s setRouteAliasBase method', () => {
                            sinon.assert.calledOnce(fakeControllerSetRouteAliasBase);
                        });
                        it('Calls controller\'s serve method', () => {
                            sinon.assert.calledOnce(fakeControllerServe);
                        });
                    });
                });
            });
            describe('Middlewares are not empty', () => {
                beforeEach(() => {
                    let BaseMiddleware = require('../../index.js').BaseMiddleware;
                    class FakeMiddleware extends BaseMiddleware{
                        static run(request, response, next) {
                            next();
                        }
                    }
                    testMiddlewares = [
                        FakeMiddleware
                    ];
                });
                describe('Controller is BaseController', () => {
                    beforeEach(() => {
                        let { BaseController } = require('../../index.js');
                        class FakeControllerClass extends BaseController{
                            constructor(...parameters){
                                fakeControllerConstructor(...parameters);
                                return FakeControllerClass.prototype;
                            }
                        }
                        FakeControllerClass.prototype.serve = fakeControllerServe;
                        fakeController = FakeControllerClass;
                        testRoute = new Route('/', 'GET', fakeController);
                        sinon.spy(testRoute, 'runMiddlewares');
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'undefined\' value', () => {
                            assert.isUndefined(testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares));
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares);
                        });
                        it('instantiates Controller', () => {
                            sinon.assert.calledOnce(fakeControllerConstructor);
                        });
                        it('Not calls controller\'s setRouteAliasBase method', () => {
                            sinon.assert.notCalled(fakeControllerSetRouteAliasBase);
                        });
                        it('Calls controller\'s serve method', () => {
                            sinon.assert.calledOnce(fakeControllerServe);
                        });
                        it('Calls itself as many times as many middlewares have been passed', () => {
                            sinon.assert.callCount(testRoute.runMiddlewares, testMiddlewares.length + 1);
                        });
                    });
                });
                describe('Controller is ResourceController', () => {
                    beforeEach(() => {
                        let { ResourceController } = require('../../index.js');
                        class FakeControllerClass extends ResourceController{
                            constructor(...parameters){
                                fakeControllerConstructor(...parameters);
                                return FakeControllerClass.prototype;
                            }
                        }
                        FakeControllerClass.prototype.serve = fakeControllerServe;
                        FakeControllerClass.prototype.setRouteAliasBase = fakeControllerSetRouteAliasBase;
                        fakeController = FakeControllerClass;
                        testRoute = new Route('/', 'GET', fakeController);
                        sinon.spy(testRoute, 'runMiddlewares');
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'undefined\' value', () => {
                            assert.isUndefined(testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares));
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            testRoute.runMiddlewares(testRequest, testResponse, testMiddlewares);
                        });
                        it('instantiates Controller', () => {
                            sinon.assert.calledOnce(fakeControllerConstructor);
                        });
                        it('Calls controller\'s setRouteAliasBase method', () => {
                            sinon.assert.calledOnce(fakeControllerSetRouteAliasBase);
                        });
                        it('Calls controller\'s serve method', () => {
                            sinon.assert.calledOnce(fakeControllerServe);
                        });
                        it('Calls itself as many times as many middlewares have been passed', () => {
                            sinon.assert.callCount(testRoute.runMiddlewares, testMiddlewares.length + 1);
                        });
                    });
                });
            });
        });
        describe('isMatching', () => {
            let testRoute,
                testRequest,
                testURLIsMatching;
            beforeEach(() => {
                testRoute = new Route('/', 'GET');
                testRoute.urlIsMatching = sinon.fake(() => {
                    return testURLIsMatching;
                });
                testRequest = {};
            });
            describe('URL does not match', () => {
                beforeEach(() => {
                    testURLIsMatching = false;
                });
                describe('Method does not match', () => {
                    beforeEach(() => {
                        testRequest.method = testRoute.method + 'foo';
                    });
                    describe('Upgrade does not match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = !testRequest.websocket;
                        });
                        it('Returns false', () => {
                            assert.isFalse(testRoute.isMatching(testRequest));
                        });
                    });
                    describe('Upgrade does match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = testRequest.websocket;
                        });
                        it('Returns false', () => {
                            assert.isFalse(testRoute.isMatching(testRequest));
                        });
                    });
                });
                describe('Method does match', () => {
                    beforeEach(() => {
                        testRequest.method = testRoute.method;
                    });
                    describe('Upgrade does not match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = !testRoute.websocket;
                        });
                        it('Returns false', () => {
                            assert.isFalse(testRoute.isMatching(testRequest));
                        });
                    });
                    describe('Upgrade does match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = testRoute.websocket;
                        });
                        it('Returns false', () => {
                            assert.isFalse(testRoute.isMatching(testRequest));
                        });
                    });
                });
            });
            describe('URL does match', () => {
                beforeEach(() => {
                    testURLIsMatching = true;
                });
                describe('Method does not match', () => {
                    beforeEach(() => {
                        testRequest.method = testRoute.method + 'foo';
                    });
                    describe('Upgrade does not match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = !testRoute.websocket;
                        });
                        it('Returns false', () => {
                            assert.isFalse(testRoute.isMatching(testRequest));
                        });
                    });
                    describe('Upgrade does match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = testRoute.websocket;
                        });
                        it('Returns false', () => {
                            assert.isFalse(testRoute.isMatching(testRequest));
                        });
                    });
                });
                describe('Method does match', () => {
                    beforeEach(() => {
                        testRequest.method = testRoute.method;
                    });
                    describe('Upgrade does not match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = !testRoute.websocket;
                        });
                        it('Returns false', () => {
                            assert.isFalse(testRoute.isMatching(testRequest));
                        });
                    });
                    describe('Upgrade does match', () => {
                        beforeEach(() => {
                            testRequest.upgrade = testRoute.websocket;
                        });
                        it('Returns itself', () => {
                            assert.equal(testRoute.isMatching(testRequest), testRoute);
                        });
                    });
                });
            });
        });
        describe('urlIsMatching', () => {
            let testRoute,
                testRequest,
                fakeTrimURL;
            beforeEach(() => {
                fakeTrimURL = sinon.fake((url) => {
                    return url;
                });
                Route = proxyquire.load('../../src/Route.js', {
                    './services/ServiceProvider.js': {
                        getRouteService: () => {
                            return {
                                trimURL: fakeTrimURL
                            };
                        }
                    }
                });
                testRoute = new Route('/', 'GET');
                testRequest = {
                };
            });
            describe('The url does not contains URL parameters', () => {
                describe('URL does not match', () => {
                    describe('URL parts count not match', () => {
                        beforeEach(() => {
                            testRequest.url = testRoute.route + 'foo/bar';
                        });
                        describe('Without route parameters', () => {
                            describe('Returns correct value', () => {
                                it('Returns boolean', () => {
                                    assert.isBoolean(testRoute.urlIsMatching(testRequest));
                                });
                                it('Returned value is false', () => {
                                    assert.isFalse(testRoute.urlIsMatching(testRequest));
                                });
                            });
                            describe('Calls methods', () => {
                                describe('Calls \'trimURL\' method of RouteService', () => {
                                    beforeEach(() => {
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Calls it twice', () => {
                                        sinon.assert.calledTwice(fakeTrimURL);
                                    });
                                    it('Firstly calls with the requested URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                            testRequest.url
                                        ]);
                                    });
                                    it('Secondly calls with the route\'s URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                            testRoute.route
                                        ]);
                                    });
                                });
                                describe('Not calls \'substring\' method of string', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'substring');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Method not called', () => {
                                        sinon.assert.notCalled(String.prototype.substring);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                                describe('Calls \'indexOf\' method of \'string\'', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'indexOf');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Called once', () => {
                                        sinon.assert.callCount(String.prototype.indexOf, 1);
                                    });
                                    it('Called with correct parameters', () => {
                                        assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                            '?'
                                        ]);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                            });
                        });
                        describe('With route parameters', () => {
                            beforeEach(() => {
                                testRoute = new Route('/{parameter}', 'GET');
                                testRequest.url = '/foo/bar';
                            });
                            describe('Returns correct value', () => {
                                it('Returns boolean', () => {
                                    assert.isBoolean(testRoute.urlIsMatching(testRequest));
                                });
                                it('Returned value is false', () => {
                                    assert.isFalse(testRoute.urlIsMatching(testRequest));
                                });
                            });
                            describe('Calls methods', () => {
                                describe('Calls \'trimURL\' method of RouteService', () => {
                                    beforeEach(() => {
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Calls it twice', () => {
                                        sinon.assert.calledTwice(fakeTrimURL);
                                    });
                                    it('Firstly calls with the requested URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                            testRequest.url
                                        ]);
                                    });
                                    it('Secondly calls with the route\'s URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                            testRoute.route
                                        ]);
                                    });
                                });
                                describe('Not calls \'substring\' method of string', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'substring');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Method not called', () => {
                                        sinon.assert.notCalled(String.prototype.substring);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                                describe('Calls \'indexOf\' method of \'string\'', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'indexOf');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Method not called', () => {
                                        sinon.assert.callCount(String.prototype.indexOf, 6);
                                    });
                                    it('Called with correct parameters', () => {
                                        assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                            '?'
                                        ]);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                            });
                        });
                    });
                    describe('URL parts count match', () => {
                        beforeEach(() => {
                            testRequest.url = testRoute.route + 'foo';
                        });
                        describe('Without route parameters', () => {
                            describe('Returns correct value', () => {
                                it('Returns boolean', () => {
                                    assert.isBoolean(testRoute.urlIsMatching(testRequest));
                                });
                                it('Returned value is false', () => {
                                    assert.isFalse(testRoute.urlIsMatching(testRequest));
                                });
                            });
                            describe('Calls methods', () => {
                                describe('Calls \'trimURL\' method of RouteService', () => {
                                    beforeEach(() => {
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Calls it twice', () => {
                                        sinon.assert.calledTwice(fakeTrimURL);
                                    });
                                    it('Firstly calls with the requested URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                            testRequest.url
                                        ]);
                                    });
                                    it('Secondly calls with the route\'s URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                            testRoute.route
                                        ]);
                                    });
                                });
                                describe('Calls \'substring\' method of string', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'substring');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Method called twice', () => {
                                        sinon.assert.calledTwice(String.prototype.substring);
                                    });
                                    it('Firstly calls with correct parameters', () => {
                                        assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                            0,
                                            1
                                        ]);
                                    });
                                    it('Secondly calls with correct parameters', () => {
                                        assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                            0,
                                            1
                                        ]);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                                describe('Calls \'indexOf\' method of \'string\'', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'indexOf');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Method not called', () => {
                                        sinon.assert.callCount(String.prototype.indexOf, 6);
                                    });
                                    it('Called with correct parameters', () => {
                                        assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                            '?'
                                        ]);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                            });
                        });
                    });
                });
                describe('URL does match', () => {
                    describe('Without route parameters', () => {
                        beforeEach(() => {
                            testRequest.url = testRoute.route;
                        });
                        describe('Returns correct value', () => {
                            it('Returns boolean', () => {
                                assert.isBoolean(testRoute.urlIsMatching(testRequest));
                            });
                            it('Returned value is true', () => {
                                assert.isTrue(testRoute.urlIsMatching(testRequest));
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls \'trimURL\' method of RouteService', () => {
                                beforeEach(() => {
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Calls it twice', () => {
                                    sinon.assert.calledTwice(fakeTrimURL);
                                });
                                it('Firstly calls with the requested URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                        testRequest.url
                                    ]);
                                });
                                it('Secondly calls with the route\'s URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                        testRoute.route
                                    ]);
                                });
                            });
                            describe('Not calls \'substring\' method of string', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'substring');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method called', () => {
                                    sinon.assert.calledTwice(String.prototype.substring);
                                });
                                it('Firstly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                        0,
                                        1
                                    ]);
                                })
                                it('Secondly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                        0,
                                        1
                                    ]);
                                })
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                            describe('Calls \'indexOf\' method of \'string\'', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'indexOf');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method not called', () => {
                                    sinon.assert.callCount(String.prototype.indexOf, 6);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                        '?'
                                    ]);
                                });
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                        });
                    });
                    describe('With route parameters', () => {
                        beforeEach(() => {
                            testRoute = new Route('/{parameter}', 'GET');
                            testRequest.url = '/foo';
                        });
                        describe('Returns correct value', () => {
                            it('Returns boolean', () => {
                                assert.isBoolean(testRoute.urlIsMatching(testRequest));
                            });
                            it('Returned value is true', () => {
                                assert.isTrue(testRoute.urlIsMatching(testRequest));
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls \'trimURL\' method of RouteService', () => {
                                beforeEach(() => {
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Calls it twice', () => {
                                    sinon.assert.calledTwice(fakeTrimURL);
                                });
                                it('Firstly calls with the requested URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                        testRequest.url
                                    ]);
                                });
                                it('Secondly calls with the route\'s URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                        testRoute.route
                                    ]);
                                });
                            });
                            describe('Calls \'substring\' method of string', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'substring');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method called', () => {
                                    sinon.assert.calledThrice(String.prototype.substring);
                                });
                                it('Firstly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                        0,
                                        1
                                    ]);
                                });
                                it('Secondly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                        0,
                                        1
                                    ]);
                                });
                                it('Secondly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(2).args, [
                                        10,
                                        11
                                    ]);
                                });
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                            describe('Calls \'indexOf\' method of \'string\'', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'indexOf');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method not called', () => {
                                    sinon.assert.callCount(String.prototype.indexOf, 6);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                        '?'
                                    ]);
                                });
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                        });
                    });
                });
            });


            
            describe('The url does not contains URL parameters', () => {
                describe('URL does not match', () => {
                    describe('URL parts count not match', () => {
                        let originalURL;
                        beforeEach(() => {
                            testRequest.url = testRoute.route + 'foo/bar';
                            originalURL = testRequest.url
                            testRequest.url += '?';
                        });
                        describe('Without route parameters', () => {
                            describe('Returns correct value', () => {
                                it('Returns boolean', () => {
                                    assert.isBoolean(testRoute.urlIsMatching(testRequest));
                                });
                                it('Returned value is false', () => {
                                    assert.isFalse(testRoute.urlIsMatching(testRequest));
                                });
                            });
                            describe('Calls methods', () => {
                                describe('Calls \'trimURL\' method of RouteService', () => {
                                    beforeEach(() => {
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Calls it twice', () => {
                                        sinon.assert.calledTwice(fakeTrimURL);
                                    });
                                    it('Firstly calls with the requested URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                            originalURL
                                        ]);
                                    });
                                    it('Secondly calls with the route\'s URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                            testRoute.route
                                        ]);
                                    });
                                });
                                describe('Not calls \'substring\' method of string', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'substring');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(String.prototype.substring);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(String.prototype.substring, testRoute.route.length - 1);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                                describe('Calls \'indexOf\' method of \'string\'', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'indexOf');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Called 7 times', () => {
                                        sinon.assert.callCount(String.prototype.indexOf, 7);
                                    });
                                    it('Firstly called with correct parameters', () => {
                                        assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                            '?'
                                        ]);
                                    });
                                    it('Secondly called with correct parameters', () => {
                                        assert.deepEqual(String.prototype.indexOf.getCall(1).args, [
                                            '?'
                                        ]);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                            });
                        });
                        describe('With route parameters', () => {
                            beforeEach(() => {
                                testRoute = new Route('/{parameter}', 'GET');
                                testRequest.url = '/foo/bar?';
                            });
                            describe('Returns correct value', () => {
                                it('Returns boolean', () => {
                                    assert.isBoolean(testRoute.urlIsMatching(testRequest));
                                });
                                it('Returned value is false', () => {
                                    assert.isFalse(testRoute.urlIsMatching(testRequest));
                                });
                            });
                            describe('Calls methods', () => {
                                describe('Calls \'trimURL\' method of RouteService', () => {
                                    beforeEach(() => {
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Calls it twice', () => {
                                        sinon.assert.calledTwice(fakeTrimURL);
                                    });
                                    it('Firstly calls with the requested URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                            originalURL
                                        ]);
                                    });
                                    it('Secondly calls with the route\'s URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                            testRoute.route
                                        ]);
                                    });
                                });
                                describe('Not calls \'substring\' method of string', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'substring');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Called once', () => {
                                        sinon.assert.calledOnce(String.prototype.substring);
                                    });
                                    it('Called with correct parameters', () => {
                                        sinon.assert.alwaysCalledWith(String.prototype.substring);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                                describe('Calls \'indexOf\' method of \'string\'', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'indexOf');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Called 7 times', () => {
                                        sinon.assert.callCount(String.prototype.indexOf, 7);
                                    });
                                    it('Called with correct parameters', () => {
                                        assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                            '?'
                                        ]);
                                        it('Secondly called with correct parameters', () => {
                                            assert.deepEqual(String.prototype.indexOf.getCall(1).args, [
                                                '?'
                                            ]);
                                        });
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                            });
                        });
                    });
                    describe('URL parts count match', () => {
                        let originalURL;
                        beforeEach(() => {
                            testRequest.url = testRoute.route + 'foo';
                            originalURL = testRequest.url;
                            testRequest.url += '?';
                        });
                        describe('Without route parameters', () => {
                            describe('Returns correct value', () => {
                                it('Returns boolean', () => {
                                    assert.isBoolean(testRoute.urlIsMatching(testRequest));
                                });
                                it('Returned value is false', () => {
                                    assert.isFalse(testRoute.urlIsMatching(testRequest));
                                });
                            });
                            describe('Calls methods', () => {
                                describe('Calls \'trimURL\' method of RouteService', () => {
                                    beforeEach(() => {
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Calls it twice', () => {
                                        sinon.assert.calledTwice(fakeTrimURL);
                                    });
                                    it('Firstly calls with the requested URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                            originalURL
                                        ]);
                                    });
                                    it('Secondly calls with the route\'s URL', () => {
                                        assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                            testRoute.route
                                        ]);
                                    });
                                });
                                describe('Calls \'substring\' method of string', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'substring');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Method called thrice', () => {
                                        sinon.assert.calledThrice(String.prototype.substring);
                                    });
                                    it('Firstly calls with correct parameters', () => {
                                        assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                            0,
                                            4
                                        ]);
                                    });
                                    it('Secondly calls with correct parameters', () => {
                                        assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                            0,
                                            1
                                        ]);
                                    });
                                    it('Thricely calls with correct parameters', () => {
                                        assert.deepEqual(String.prototype.substring.getCall(2).args, [
                                            0,
                                            1
                                        ]);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                                describe('Calls \'indexOf\' method of \'string\'', () => {
                                    beforeEach(() => {
                                        sinon.spy(String.prototype, 'indexOf');
                                        testRoute.urlIsMatching(testRequest);
                                    });
                                    it('Called 7 times', () => {
                                        sinon.assert.callCount(String.prototype.indexOf, 7);
                                    });
                                    it('Called with correct parameters', () => {
                                        assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                            '?'
                                        ]);
                                    });
                                    afterEach(() => {
                                        sinon.restore();
                                    });
                                });
                            });
                        });
                    });
                });
                describe('URL does match', () => {
                    describe('Without route parameters', () => {
                        beforeEach(() => {
                            testRequest.url = testRoute.route;
                        });
                        describe('Returns correct value', () => {
                            it('Returns boolean', () => {
                                assert.isBoolean(testRoute.urlIsMatching(testRequest));
                            });
                            it('Returned value is true', () => {
                                assert.isTrue(testRoute.urlIsMatching(testRequest));
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls \'trimURL\' method of RouteService', () => {
                                beforeEach(() => {
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Calls it twice', () => {
                                    sinon.assert.calledTwice(fakeTrimURL);
                                });
                                it('Firstly calls with the requested URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                        testRequest.url
                                    ]);
                                });
                                it('Secondly calls with the route\'s URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                        testRoute.route
                                    ]);
                                });
                            });
                            describe('Not calls \'substring\' method of string', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'substring');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method called', () => {
                                    sinon.assert.calledTwice(String.prototype.substring);
                                });
                                it('Firstly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                        0,
                                        1
                                    ]);
                                })
                                it('Secondly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                        0,
                                        1
                                    ]);
                                })
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                            describe('Calls \'indexOf\' method of \'string\'', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'indexOf');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method not called', () => {
                                    sinon.assert.callCount(String.prototype.indexOf, 6);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                        '?'
                                    ]);
                                });
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                        });
                    });
                    describe('With route parameters', () => {
                        beforeEach(() => {
                            testRoute = new Route('/{parameter}', 'GET');
                            testRequest.url = '/foo';
                        });
                        describe('Returns correct value', () => {
                            it('Returns boolean', () => {
                                assert.isBoolean(testRoute.urlIsMatching(testRequest));
                            });
                            it('Returned value is true', () => {
                                assert.isTrue(testRoute.urlIsMatching(testRequest));
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls \'trimURL\' method of RouteService', () => {
                                beforeEach(() => {
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Calls it twice', () => {
                                    sinon.assert.calledTwice(fakeTrimURL);
                                });
                                it('Firstly calls with the requested URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                        testRequest.url
                                    ]);
                                });
                                it('Secondly calls with the route\'s URL', () => {
                                    assert.deepEqual(fakeTrimURL.getCall(1).args, [
                                        testRoute.route
                                    ]);
                                });
                            });
                            describe('Calls \'substring\' method of string', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'substring');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method called', () => {
                                    sinon.assert.calledThrice(String.prototype.substring);
                                });
                                it('Firstly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                        0,
                                        1
                                    ]);
                                });
                                it('Secondly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                        0,
                                        1
                                    ]);
                                });
                                it('Secondly called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(2).args, [
                                        10,
                                        11
                                    ]);
                                });
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                            describe('Calls \'indexOf\' method of \'string\'', () => {
                                beforeEach(() => {
                                    sinon.spy(String.prototype, 'indexOf');
                                    testRoute.urlIsMatching(testRequest);
                                });
                                it('Method not called', () => {
                                    sinon.assert.callCount(String.prototype.indexOf, 6);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.indexOf.getCall(0).args, [
                                        '?'
                                    ]);
                                });
                                afterEach(() => {
                                    sinon.restore();
                                });
                            });
                        });
                    });
                });
            });



        });
        describe('getRouteVariableNames', () => {
            let testRoute,
                fakeGetRouteService,
                fakeTrimURL;
            beforeEach(() => {
                fakeTrimURL = sinon.fake((url) => {
                    return url;
                });
                fakeGetRouteService = sinon.fake(() => {
                    return {
                        trimURL: fakeTrimURL
                    }
                });
                Route = proxyquire.load('../../src/Route.js', {
                    './services/ServiceProvider.js': {
                        getRouteService: fakeGetRouteService
                    }
                });
                sinon.spy(String.prototype, 'split');
                sinon.spy(String.prototype, 'substring');
            });
            describe('Route not contains route variables', () => {
                beforeEach(() => {
                    testRoute = new Route('/foo', 'GET');
                });
                describe('Returns correct value', () => {
                    it('Returns object', () => {
                        assert.isObject(testRoute.getRouteVariableNames());
                    });
                    it('Returned object is correct', () => {
                        assert.deepEqual(testRoute.getRouteVariableNames(), {});
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        testRoute.getRouteVariableNames();
                    });
                    describe('Calls \'getRouteService\' method of ServiceProvider', () => {
                        it('Calls method', () => {
                            sinon.assert.calledOnce(fakeGetRouteService);
                        });
                        it('Firstly calls method with correct paramaters', () => {
                            assert.deepEqual(fakeGetRouteService.getCall(0).args, [
                            ]);
                        });
                    });
                    describe('Calls \'trimURL\' method of RouteService', () => {
                        it('Calls method', () => {
                            sinon.assert.calledOnce(fakeTrimURL);
                        });
                        it('Firstly calls method with correct paramaters', () => {
                            assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                testRoute.route
                            ]);
                        });
                    });
                    describe('Calls \'split\' method of string', () => {
                        it('Calls method', () => {
                            sinon.assert.calledOnce(String.prototype.split);
                        });
                        it('Firstly calls method with correct paramaters', () => {
                            assert.deepEqual(String.prototype.split.getCall(0).args, [
                                '/'
                            ]);
                        });
                    });
                    describe('Calls \'substring\' method of string', () => {
                        it('Calls method', () => {
                            sinon.assert.calledTwice(String.prototype.substring);
                        });
                        it('Firstly calls method with correct paramaters', () => {
                            assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                0,
                                1
                            ]);
                        });
                        it('Secondly calls method with correct paramaters', () => {
                            assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                0,
                                1
                            ]);
                        });
                    });
                });
            });
            describe('Route contains route variables', () => {
                beforeEach(() => {
                    testRoute = new Route('/{foo}', 'GET');
                });
                describe('Returns correct value', () => {
                    it('Returns object', () => {
                        assert.isObject(testRoute.getRouteVariableNames());
                    });
                    it('Returned object is correct', () => {
                        assert.deepEqual(testRoute.getRouteVariableNames(), {
                            1: 'foo'
                        });
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        testRoute.getRouteVariableNames();
                    });
                    describe('Calls \'getRouteService\' method of ServiceProvider', () => {
                        it('Calls method', () => {
                            sinon.assert.calledOnce(fakeGetRouteService);
                        });
                        it('Firstly method was called with correct parameters', () => {
                            assert.deepEqual(fakeGetRouteService.getCall(0).args, [
                            ]);
                        });
                    });
                    describe('Calls \'trimURL\' method of RouteService', () => {
                        it('Calls method', () => {
                            sinon.assert.calledOnce(fakeTrimURL);
                        });
                        it('Firstly method was called with correct parameters', () => {
                            assert.deepEqual(fakeTrimURL.getCall(0).args, [
                                testRoute.route
                            ]);
                        });
                    });
                    describe('Calls \'split\' method of string', () => {
                        it('Calls method', () => {
                            sinon.assert.calledOnce(String.prototype.split);
                        });
                        it('Firstly method was called with correct parameters', () => {
                            assert.deepEqual(String.prototype.split.getCall(0).args, [
                                '/'
                            ]);
                        });
                    });
                    describe('Calls \'substring\' method of string', () => {
                        it('Calls method', () => {
                            sinon.assert.callCount(String.prototype.substring, 4);
                        });
                        it('For the first time, method was called with correct parameters', () => {
                            assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                0,
                                1
                            ]);
                        });
                        it('For the second time, method was called with correct parameters', () => {
                            assert.deepEqual(String.prototype.substring.getCall(1).args, [
                                0,
                                1
                            ]);
                        });
                        it('For the third time, method was called with correct parameters', () => {
                            assert.deepEqual(String.prototype.substring.getCall(2).args, [
                                4,
                                5
                            ]);
                        });
                        it('For the fourth time, method was called with correct parameters', () => {
                            assert.deepEqual(String.prototype.substring.getCall(3).args, [
                                1,
                                4
                            ]);
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('as', () => {
            let testRoute,
                testAlias;
            beforeEach(() => {
                testRoute = new Route('/', 'GET');
                testAlias = 'foo';
            });
            describe('Returns correct value', () => {
                it('Returns object', () => {
                    assert.isObject(testRoute.as(testAlias));
                });
                it('Returns instance of Route', () => {
                    assert.instanceOf(testRoute.as(testAlias), Route);
                });
                it('Returns the object itself', () => {
                    assert.equal(testRoute.as(testAlias), testRoute);
                });
            });
            describe('Modify attributes correctly', () => {
                beforeEach(() => {
                    testRoute.as(testAlias);
                });
                it('Sets the alias property correctly', () => {
                    assert.equal(testRoute.alias, testAlias);
                });
            });
        });
        describe('redirectToURL', () => {
            let testRoute,
                testRedirectURL;
            beforeEach(() => {
                testRoute = new Route('/', 'GET');
                testRedirectURL = 'foo';
            });
            describe('Returns correct value', () => {
                it('Returns object', () => {
                    assert.isObject(testRoute.redirectToURL(testRedirectURL));
                });
                it('Returns instance of Route', () => {
                    assert.instanceOf(testRoute.redirectToURL(testRedirectURL), Route);
                });
                it('Returns the object itself', () => {
                    assert.equal(testRoute.redirectToURL(testRedirectURL), testRoute);
                });
            });
            describe('Modify attributes correctly', () => {
                beforeEach(() => {
                    testRoute.redirectToURL(testRedirectURL);
                });
                it('Sets the redirectURL property correctly', () => {
                    assert.equal(testRoute.redirectURL, testRedirectURL);
                });
            });
        });
        describe('redirectToRoute', () => {
            let testRoute,
                testRedirectRouteAlias;
            beforeEach(() => {
                testRoute = new Route('/', 'GET');
                testRedirectRouteAlias = 'foo';
            });
            describe('Returns correct value', () => {
                it('Returns object', () => {
                    assert.isObject(testRoute.redirectToRoute(testRedirectRouteAlias));
                });
                it('Returns instance of Route', () => {
                    assert.instanceOf(testRoute.redirectToRoute(testRedirectRouteAlias), Route);
                });
                it('Returns the object itself', () => {
                    assert.equal(testRoute.redirectToRoute(testRedirectRouteAlias), testRoute);
                });
            });
            describe('Modify attributes correctly', () => {
                beforeEach(() => {
                    testRoute.redirectToRoute(testRedirectRouteAlias);
                });
                it('Sets the redirectRouteAlias property correctly', () => {
                    assert.equal(testRoute.redirectRouteAlias, testRedirectRouteAlias);
                });
            });
        });
        describe('toString', () => {
            let testRoute,
                testParameters,
                testParameterKey,
                testParameterValue;
            beforeEach(() => {
                sinon.spy(String.prototype, 'match');
                sinon.spy(String.prototype, 'replace');
            });
            describe('The route does not contain parameters', () => {
                beforeEach(() => {
                    testRoute = new Route('/', 'GET');
                });
                describe('The \'parameters\' parameter is not defined', () => {
                    describe('Returns correct value', () => {
                        it('Returns string', () => {
                            assert.isString(testRoute.toString());
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.lengthOf(testRoute.toString(), 1);
                        });
                        it('Returned string is correct', () => {
                            assert.equal(testRoute.toString(), '/');
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            testRoute.toString();
                        });
                        it('Calls \'match\' method of string one times', () => {
                            sinon.assert.calledOnce(String.prototype.match);
                        });
                        it('Does not call \'replace\' method of string', () => {
                            sinon.assert.notCalled(String.prototype.replace);
                        });
                    });
                });
                describe('The \'parameters\' parameter is not defined', () => {
                    describe('Returns correct value', () => {
                        it('Returns string', () => {
                            assert.isString(testRoute.toString());
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.lengthOf(testRoute.toString(), 1);
                        });
                        it('Returned string is correct', () => {
                            assert.equal(testRoute.toString(), '/');
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            testRoute.toString();
                        });
                        it('Calls \'match\' method of string one times', () => {
                            sinon.assert.calledOnce(String.prototype.match);
                        });
                        it('Does not call \'replace\' method of string', () => {
                            sinon.assert.notCalled(String.prototype.replace);
                        });
                    });
                });
            });
            describe('The route contains parameters', () => {
                beforeEach(() => {
                    testParameterKey = 'foo';
                    testParameterValue = 'bar';
                    testParameters = {
                    };
                    testParameters[testParameterKey] = testParameterValue;
                    testRoute = new Route('/{' + testParameterKey +'}', 'GET');
                });
                describe('The \'parameters\' parameter is not defined', () => {
                    describe('Returns correct value', () => {
                        it('Throws Error object', (done) => {
                            try{
                                testRoute.toString();
                            }
                            catch (e){
                                done();
                            }
                        });
                        it('Thrown Error object\'s message is correct', (done) => {
                            try{
                                testRoute.toString();
                            }
                            catch (e){
                                done(e.message !== 'Cannot read property \'foo\' of undefined');
                            }
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            try{
                                testRoute.toString();
                            }
                            catch (e){
                            }
                        });
                        it('Calls \'match\' method of string one times', () => {
                            sinon.assert.calledOnce(String.prototype.match);
                        });
                        it('Does not call \'replace\' method of string', () => {
                            sinon.assert.calledTwice(String.prototype.replace);
                        });
                    });
                });
                describe('The \'parameters\' parameter is defined', () => {
                    describe('Not every required parameter is presented in the \'parameters\' parameter', () => {
                        beforeEach(() => {
                            testParameters = {};
                        });
                        describe('Returns correct value', () => {
                            it('Throws Error object', (done) => {
                                try{
                                    assert.isString(testRoute.toString(testParameters));
                                }
                                catch (e){
                                    done();
                                }
                            });
                            it('Thrown Error object\'s message is correct', (done) => {
                                try{
                                    testRoute.toString(testParameters);
                                }
                                catch (e){
                                    done(e.message !== 'Required parameter \'foo\' for route \'undefined\' is not present!');
                                }
                            });
                        });
                        describe('Calls methods', () => {
                            beforeEach(() => {
                                try{
                                    testRoute.toString(testParameters);
                                }
                                catch (e){
                                }
                            });
                            it('Calls \'match\' method of string one times', () => {
                                sinon.assert.calledOnce(String.prototype.match);
                            });
                            it('Does not call \'replace\' method of string', () => {
                                sinon.assert.calledTwice(String.prototype.replace);
                            });
                        });
                    });
                    describe('Every required parameter is presented in the \'parameters\' parameter', () => {
                        describe('Returns correct value', () => {
                            it('Returns string', () => {
                                assert.isString(testRoute.toString(testParameters));
                            });
                            it('Returned string\'s length is correct', () => {
                                assert.lengthOf(testRoute.toString(testParameters), 4);
                            });
                            it('Returned string is correct', () => {
                                assert.equal(testRoute.toString(testParameters), '/' + testParameterValue);
                            });
                        });
                        describe('Calls methods', () => {
                            beforeEach(() => {
                                testRoute.toString(testParameters);
                            });
                            it('Calls \'match\' method of string one times', () => {
                                sinon.assert.calledOnce(String.prototype.match);
                            });
                            it('Does not call \'replace\' method of string', () => {
                                sinon.assert.callCount(String.prototype.replace, 3);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('static get', () => {
            let testURL,
                testMethod,
                testController,
                testControllerFunction,
                testMiddlewares,
                testWebsocket,
                testRouteAliasBase;
            beforeEach(() => {
                testURL = '/';
                testMethod = 'GET';
                testController = {};
                sinon.spy(Route.prototype, 'setMiddlewares');
            });
            describe('Called with minimal parameters', () => {
                beforeEach(() => {
                    testControllerFunction = 'serve';
                    testMiddlewares = [
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.get(testURL, testController);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            describe('Called with all parameters specified', () => {
                beforeEach(() => {
                    testControllerFunction = 'testControllerFunction';
                    testMiddlewares = [
                        {
                            foo: 'bar'
                        }
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.get(testURL, testController, testControllerFunction, testMiddlewares);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('static post', () => {
            let testURL,
                testMethod,
                testController,
                testControllerFunction,
                testMiddlewares,
                testWebsocket,
                testRouteAliasBase;
            beforeEach(() => {
                testURL = '/';
                testMethod = 'POST';
                testController = {};
                sinon.spy(Route.prototype, 'setMiddlewares');
            });
            describe('Called with minimal parameters', () => {
                beforeEach(() => {
                    testControllerFunction = 'serve';
                    testMiddlewares = [
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.post(testURL, testController);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            describe('Called with all parameters specified', () => {
                beforeEach(() => {
                    testControllerFunction = 'testControllerFunction';
                    testMiddlewares = [
                        {
                            foo: 'bar'
                        }
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.post(testURL, testController, testControllerFunction, testMiddlewares);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('static put', () => {
            let testURL,
                testMethod,
                testController,
                testControllerFunction,
                testMiddlewares,
                testWebsocket,
                testRouteAliasBase;
            beforeEach(() => {
                testURL = '/';
                testMethod = 'PUT';
                testController = {};
                sinon.spy(Route.prototype, 'setMiddlewares');
            });
            describe('Called with minimal parameters', () => {
                beforeEach(() => {
                    testControllerFunction = 'serve';
                    testMiddlewares = [
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.put(testURL, testController);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            describe('Called with all parameters specified', () => {
                beforeEach(() => {
                    testControllerFunction = 'testControllerFunction';
                    testMiddlewares = [
                        {
                            foo: 'bar'
                        }
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.put(testURL, testController, testControllerFunction, testMiddlewares);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('static update', () => {
            let testURL,
                testMethod,
                testController,
                testControllerFunction,
                testMiddlewares,
                testWebsocket,
                testRouteAliasBase;
            beforeEach(() => {
                testURL = '/';
                testMethod = 'UPDATE';
                testController = {};
                sinon.spy(Route.prototype, 'setMiddlewares');
            });
            describe('Called with minimal parameters', () => {
                beforeEach(() => {
                    testControllerFunction = 'serve';
                    testMiddlewares = [
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.update(testURL, testController);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            describe('Called with all parameters specified', () => {
                beforeEach(() => {
                    testControllerFunction = 'testControllerFunction';
                    testMiddlewares = [
                        {
                            foo: 'bar'
                        }
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.update(testURL, testController, testControllerFunction, testMiddlewares);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('static delete', () => {
            let testURL,
                testMethod,
                testController,
                testControllerFunction,
                testMiddlewares,
                testWebsocket,
                testRouteAliasBase;
            beforeEach(() => {
                testURL = '/';
                testMethod = 'DELETE';
                testController = {};
                sinon.spy(Route.prototype, 'setMiddlewares');
            });
            describe('Called with minimal parameters', () => {
                beforeEach(() => {
                    testControllerFunction = 'serve';
                    testMiddlewares = [
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.delete(testURL, testController);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            describe('Called with all parameters specified', () => {
                beforeEach(() => {
                    testControllerFunction = 'testControllerFunction';
                    testMiddlewares = [
                        {
                            foo: 'bar'
                        }
                    ];
                    testWebsocket = false;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.delete(testURL, testController, testControllerFunction, testMiddlewares);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('static websocket', () => {
            let testURL,
                testMethod,
                testController,
                testControllerFunction,
                testMiddlewares,
                testWebsocket,
                testRouteAliasBase;
            beforeEach(() => {
                testURL = '/';
                testMethod = 'GET';
                testController = {};
                sinon.spy(Route.prototype, 'setMiddlewares');
            });
            describe('Called with minimal parameters', () => {
                beforeEach(() => {
                    testControllerFunction = 'serve';
                    testMiddlewares = [
                    ];
                    testWebsocket = true;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.websocket(testURL, testController);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            describe('Called with all parameters specified', () => {
                beforeEach(() => {
                    testControllerFunction = 'testControllerFunction';
                    testMiddlewares = [
                        {
                            foo: 'bar'
                        }
                    ];
                    testWebsocket = true;
                    testRouteAliasBase = "";
                });
                describe('Returns correct value', () => {
                    let testRoute;
                    beforeEach(() => {
                        testRoute = Route.websocket(testURL, testController, testControllerFunction, testMiddlewares);
                    });
                    it('Returns object', () => {
                        assert.isObject(testRoute);
                    });
                    it('Returns instance of \'Route\' class', () => {
                        assert.instanceOf(testRoute, Route);
                    });
                    describe('The returned object\'s attributes are correct', () => {
                        it('route', () => {
                            assert.equal(testRoute.route, testURL);
                        });
                        it('method', () => {
                            assert.equal(testRoute.method, testMethod);
                        });
                        it('Controller', () => {
                            assert.equal(testRoute.Controller, testController);
                        });
                        it('controllerFunction', () => {
                            assert.equal(testRoute.controllerFunction, testControllerFunction);
                        });
                        it('websocket', () => {
                            assert.equal(testRoute.websocket, testWebsocket);
                        });
                        it('routeAliasBase', () => {
                            assert.equal(testRoute.routeAliasBase, testRouteAliasBase);
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls the \'setMiddlewares\' method of Route', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(Route.prototype.setMiddlewares);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                    testMiddlewares
                                ]);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('static resources', () => {
            let testURL,
                testMethod,
                testController,
                testControllerFunction,
                testMiddlewares,
                testWebsocket,
                testRouteAliasBase;
            describe('Route ends with \'/\' character', () => {
                beforeEach(() => {
                    testURL = '/';
                    testMethod = 'PUT';
                    testController = {};
                    sinon.spy(Route.prototype, 'setMiddlewares');
                    sinon.spy(String.prototype, 'substring');
                    sinon.spy(String.prototype, 'endsWith');
                });
                describe('Called with minimal parameters', () => {
                    beforeEach(() => {
                        testControllerFunction = 'serve';
                        testMiddlewares = [
                        ];
                        testWebsocket = false;
                        testRouteAliasBase = "";
                    });
                    describe('Returns correct value', () => {
                        let testRoute;
                        beforeEach(() => {
                            testRoute = Route.resources(testURL, testController);
                        });
                        it('Returns array', () => {
                            assert.isArray(testRoute);
                        });
                        it('Returned array\'s length is correct', () => {
                            assert.lengthOf(testRoute, 7);
                        });
                        it('Returned array contains instances of \'Route\' class', () => {
                            assert.lengthOf(testRoute.filter((route) => {
                                return route instanceof Route;
                            }), 7);
                        });
                        describe('The returned arrays contains object\'s with correct attributes', () => {
                            describe('Element at 0 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[0].route, testURL);
                                });
                                it('method', () => {
                                    assert.equal(testRoute[0].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[0].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[0].controllerFunction, 'index');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[0].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[0].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 1 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[1].route, testURL + "create");
                                });
                                it('method', () => {
                                    assert.equal(testRoute[1].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[1].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[1].controllerFunction, 'create');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[1].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[1].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 2 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[2].route, testURL);
                                });
                                it('method', () => {
                                    assert.equal(testRoute[2].method, 'POST');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[2].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[2].controllerFunction, 'store');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[2].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[2].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 3 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[3].route, testURL + '{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[3].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[3].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[3].controllerFunction, 'show');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[3].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[3].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 4 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[4].route, testURL + '{id}/edit');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[4].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[4].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[4].controllerFunction, 'edit');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[4].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[4].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 5 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[5].route, testURL + '{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[5].method, 'PUT');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[5].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[5].controllerFunction, 'update');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[5].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[5].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 6 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[6].route, testURL + '{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[6].method, 'DELETE');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[6].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[6].controllerFunction, 'destroy');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[6].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[6].routeAliasBase, testRouteAliasBase);
                                });
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls the \'setMiddlewares\' method of Route', () => {
                                it('Called seven times', () => {
                                    sinon.assert.callCount(Route.prototype.setMiddlewares, 7);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                        testMiddlewares
                                    ]);
                                });
                            });
                            describe('Calls \'substring\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.calledOnce(String.prototype.substring);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                        0,
                                        0
                                    ]);
                                });
                            });
                            describe('Calls \'endsWith\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.calledOnce(String.prototype.endsWith);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.endsWith.getCall(0).args, [
                                        '/'
                                    ]);
                                });
                            });
                        });
                    });
                });
                describe('Called with all parameters specified', () => {
                    beforeEach(() => {
                        testMiddlewares = [
                            {
                                foo: 'bar'
                            }
                        ];
                        testWebsocket = false;
                        testRouteAliasBase = "";
                    });
                    describe('Returns correct value', () => {
                        let testRoute;
                        beforeEach(() => {
                            testRoute = Route.resources(testURL, testController, testMiddlewares);
                        });
                        it('Returns array', () => {
                            assert.isArray(testRoute);
                        });
                        it('Returned array\'s length is correct', () => {
                            assert.lengthOf(testRoute, 7);
                        });
                        it('Returned array contains instances of \'Route\' class', () => {
                            assert.lengthOf(testRoute.filter((route) => {
                                return route instanceof Route;
                            }), 7);
                        });
                        describe('The returned arrays contains object\'s with correct attributes', () => {
                            describe('Element at 0 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[0].route, testURL);
                                });
                                it('method', () => {
                                    assert.equal(testRoute[0].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[0].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[0].controllerFunction, 'index');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[0].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[0].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 1 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[1].route, testURL + "create");
                                });
                                it('method', () => {
                                    assert.equal(testRoute[1].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[1].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[1].controllerFunction, 'create');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[1].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[1].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 2 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[2].route, testURL);
                                });
                                it('method', () => {
                                    assert.equal(testRoute[2].method, 'POST');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[2].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[2].controllerFunction, 'store');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[2].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[2].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 3 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[3].route, testURL + '{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[3].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[3].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[3].controllerFunction, 'show');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[3].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[3].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 4 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[4].route, testURL + '{id}/edit');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[4].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[4].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[4].controllerFunction, 'edit');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[4].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[4].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 5 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[5].route, testURL + '{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[5].method, 'PUT');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[5].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[5].controllerFunction, 'update');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[5].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[5].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 6 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[6].route, testURL + '{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[6].method, 'DELETE');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[6].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[6].controllerFunction, 'destroy');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[6].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[6].routeAliasBase, testRouteAliasBase);
                                });
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls the \'setMiddlewares\' method of Route', () => {
                                it('Called seven times', () => {
                                    sinon.assert.callCount(Route.prototype.setMiddlewares, 7);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                        testMiddlewares
                                    ]);
                                });
                            });
                            describe('Calls \'substring\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.calledOnce(String.prototype.substring);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.substring.getCall(0).args, [
                                        0,
                                        0
                                    ]);
                                });
                            });
                            describe('Calls \'endsWith\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.calledOnce(String.prototype.endsWith);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.endsWith.getCall(0).args, [
                                        '/'
                                    ]);
                                });
                            });
                        });
                    });
                });
            });
            describe('Route not ends with \'/\' character', () => {
                beforeEach(() => {
                    testURL = '/foo';
                    testMethod = 'PUT';
                    testController = {};
                    sinon.spy(Route.prototype, 'setMiddlewares');
                    sinon.spy(String.prototype, 'substring');
                    sinon.spy(String.prototype, 'endsWith');
                });
                describe('Called with minimal parameters', () => {
                    beforeEach(() => {
                        testControllerFunction = 'serve';
                        testMiddlewares = [
                        ];
                        testWebsocket = false;
                        testRouteAliasBase = "foo";
                    });
                    describe('Returns correct value', () => {
                        let testRoute;
                        beforeEach(() => {
                            testRoute = Route.resources(testURL, testController);
                        });
                        it('Returns array', () => {
                            assert.isArray(testRoute);
                        });
                        it('Returned array\'s length is correct', () => {
                            assert.lengthOf(testRoute, 7);
                        });
                        it('Returned array contains instances of \'Route\' class', () => {
                            assert.lengthOf(testRoute.filter((route) => {
                                return route instanceof Route;
                            }), 7);
                        });
                        describe('The returned arrays contains object\'s with correct attributes', () => {
                            describe('Element at 0 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[0].route, testURL + '/');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[0].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[0].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[0].controllerFunction, 'index');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[0].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[0].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 1 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[1].route, testURL + '/create');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[1].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[1].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[1].controllerFunction, 'create');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[1].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[1].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 2 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[2].route, testURL + '/');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[2].method, 'POST');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[2].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[2].controllerFunction, 'store');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[2].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[2].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 3 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[3].route, testURL + '/{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[3].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[3].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[3].controllerFunction, 'show');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[3].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[3].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 4 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[4].route, testURL + '/{id}/edit');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[4].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[4].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[4].controllerFunction, 'edit');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[4].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[4].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 5 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[5].route, testURL + '/{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[5].method, 'PUT');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[5].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[5].controllerFunction, 'update');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[5].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[5].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 6 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[6].route, testURL + '/{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[6].method, 'DELETE');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[6].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[6].controllerFunction, 'destroy');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[6].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[6].routeAliasBase, testRouteAliasBase);
                                });
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls the \'setMiddlewares\' method of Route', () => {
                                it('Called seven times', () => {
                                    sinon.assert.callCount(Route.prototype.setMiddlewares, 7);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                        testMiddlewares
                                    ]);
                                });
                            });
                            describe('Calls \'substring\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.notCalled(String.prototype.substring);
                                });
                            });
                            describe('Calls \'endsWith\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.calledOnce(String.prototype.endsWith);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.endsWith.getCall(0).args, [
                                        '/'
                                    ]);
                                });
                            });
                        });
                    });
                });
                describe('Called with all parameters specified', () => {
                    beforeEach(() => {
                        testMiddlewares = [
                            {
                                foo: 'bar'
                            }
                        ];
                        testWebsocket = false;
                        testRouteAliasBase = "foo";
                    });
                    describe('Returns correct value', () => {
                        let testRoute;
                        beforeEach(() => {
                            testRoute = Route.resources(testURL, testController, testMiddlewares);
                        });
                        it('Returns array', () => {
                            assert.isArray(testRoute);
                        });
                        it('Returned array\'s length is correct', () => {
                            assert.lengthOf(testRoute, 7);
                        });
                        it('Returned array contains instances of \'Route\' class', () => {
                            assert.lengthOf(testRoute.filter((route) => {
                                return route instanceof Route;
                            }), 7);
                        });
                        describe('The returned arrays contains object\'s with correct attributes', () => {
                            describe('Element at 0 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[0].route, testURL + '/');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[0].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[0].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[0].controllerFunction, 'index');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[0].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[0].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 1 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[1].route, testURL + "/create");
                                });
                                it('method', () => {
                                    assert.equal(testRoute[1].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[1].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[1].controllerFunction, 'create');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[1].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[1].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 2 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[2].route, testURL + '/');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[2].method, 'POST');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[2].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[2].controllerFunction, 'store');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[2].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[2].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 3 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[3].route, testURL + '/{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[3].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[3].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[3].controllerFunction, 'show');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[3].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[3].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 4 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[4].route, testURL + '/{id}/edit');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[4].method, 'GET');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[4].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[4].controllerFunction, 'edit');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[4].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[4].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 5 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[5].route, testURL + '/{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[5].method, 'PUT');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[5].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[5].controllerFunction, 'update');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[5].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[5].routeAliasBase, testRouteAliasBase);
                                });
                            });
                            describe('Element at 6 index', () => {
                                it('route', () => {
                                    assert.equal(testRoute[6].route, testURL + '/{id}');
                                });
                                it('method', () => {
                                    assert.equal(testRoute[6].method, 'DELETE');
                                });
                                it('Controller', () => {
                                    assert.equal(testRoute[6].Controller, testController);
                                });
                                it('controllerFunction', () => {
                                    assert.equal(testRoute[6].controllerFunction, 'destroy');
                                });
                                it('websocket', () => {
                                    assert.equal(testRoute[6].websocket, testWebsocket);
                                });
                                it('routeAliasBase', () => {
                                    assert.equal(testRoute[6].routeAliasBase, testRouteAliasBase);
                                });
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls the \'setMiddlewares\' method of Route', () => {
                                it('Called seven times', () => {
                                    sinon.assert.callCount(Route.prototype.setMiddlewares, 7);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(Route.prototype.setMiddlewares.getCall(0).args, [
                                        testMiddlewares
                                    ]);
                                });
                            });
                            describe('Calls \'substring\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.notCalled(String.prototype.substring);
                                });
                            });
                            describe('Calls \'endsWith\' method of string', () => {
                                it('Called once', () => {
                                    sinon.assert.calledOnce(String.prototype.endsWith);
                                });
                                it('Called with correct parameters', () => {
                                    assert.deepEqual(String.prototype.endsWith.getCall(0).args, [
                                        '/'
                                    ]);
                                });
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
    });
});