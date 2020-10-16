let assert = require('chai').assert,
	sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();
sinon.assert.expose(assert);

describe('BaseController', () => {
	let BaseController;
	before(() => {
		BaseController = require('../../index.js').BaseController;
	});
	describe('Have basic documented methods', () => {
		it('serve', () => {
			assert.isFunction(BaseController.prototype.serve);
		});
		it('view', () => {
			assert.isFunction(BaseController.prototype.view);
		});
		it('setViewConnector', () => {
			assert.isFunction(BaseController.prototype.setViewConnector);
		});
		it('redirect', () => {
			assert.isFunction(BaseController.prototype.redirect);
		});
	});
	describe('Have basic documented attributes', () => {
		it('middlewareProvider', () => {
			assert.isFunction(BaseController.middlewareProvider);
		});
		it('ViewProvider', () => {
			assert.isFunction(BaseController.ViewProvider);
		});
	});
	describe('Methods works as expected', () => {
		let FakeControllerClass,
			fakeController,
			request,
			response;
		before(() => {
			class FakeController extends BaseController{
			}
			FakeControllerClass = FakeController;
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
			fakeController = new FakeControllerClass(request, response);
		});
		describe('Abstract methods', () => {
			describe('serve', () => {
				let { logger } = require('../../index.js');
				beforeEach(() => {
					sinon.replace(logger, 'warn', sinon.spy());
				});
				it('Method serve returns undefined', () => {
					assert.isUndefined(fakeController.serve());
				});
				it('Method serve writes warning to the console', () => {
					fakeController.serve();
					sinon.assert.calledOnce(logger.warn);
				});
				afterEach(() => {
					sinon.restore();
				});
			});
		});
		describe('Implemented methods', () => {
			beforeEach(() => {
				let cookies = [];
				response.setHeader = sinon.fake((name, value) => {
					cookies[name] = value;
				})
				response.getHeader = sinon.fake((name) => {
					return cookies[name];
				})
			});
			describe('view', () => {
				let testFilePath,
					testOptions,
					fakeConstructor,
					fakeGetView,
					fakeGetViewReturnValue;
				beforeEach(() => {
					testFilePath = 'foo';
					testOptions = {};
					fakeConstructor = sinon.fake();
					fakeGetViewReturnValue = 'bar';
					fakeGetView = sinon.fake(() => {
						return fakeGetViewReturnValue;
					});
					class fakeViewProvider{
						constructor(request, response, connector){
							fakeConstructor(request, response, connector);
						}
						getView(filePath, options, writeToResponse, endResponse){
							return fakeGetView(filePath, options, writeToResponse, endResponse);
						}
					}
					fakeController.ViewProvider = fakeViewProvider;
				});
				describe('Returns correct value', () => {
					it('Returns the same type as the \'GetView\' method of \'ViewProvider\' class', () => {
						assert.equal(typeof fakeController.view(testFilePath, testOptions), typeof fakeGetViewReturnValue);
					});
					it('Returns the same value as the \'GetView\' method of \'ViewProvider\' class', () => {
						assert.equal(fakeController.view(testFilePath, testOptions), fakeGetViewReturnValue);
					});
				});
				describe('Called with minimal parameters', () => {
					describe('Calls methods', () => {
						beforeEach(() => {
							fakeController.view(testFilePath, testOptions);
						});
						describe('Instantiates class from \'ViewProvider\' attribute of \'BaseController\' class', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeConstructor);
							});
							it('Called with correct parameters', () => {
								sinon.assert.calledWith(fakeConstructor, request, response, fakeController.viewConnector);
							});
						});
						describe('Calls the \'getView\' method on instance of class stored in the \'ViewProvier\' attribute of \'BaseController\' class', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeGetView);
							});
							it('Called with correct parameters', () => {
								sinon.assert.calledWith(fakeGetView, testFilePath, testOptions, true, true);
							});
						});
					});
				});
				describe('Called with all parameters specified', () => {
					let testWriteToResponseParameter,
						testEndResponseParameter;
					beforeEach(() => {
						testWriteToResponseParameter = false;
						testEndResponseParameter = false;
					});
					describe('Calls methods', () => {
						beforeEach(() => {
							fakeController.view(testFilePath, testOptions, testWriteToResponseParameter, testEndResponseParameter);
						});
						describe('Instantiates class from \'ViewProvider\' attribute of \'BaseController\' class', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeConstructor);
							});
							it('Called with correct parameters', () => {
								sinon.assert.calledWith(fakeConstructor, request, response, fakeController.viewConnector);
							});
						});
						describe('Calls the \'getView\' method on instance of class stored in the \'ViewProvier\' attribute of \'BaseController\' class', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeGetView);
							});
							it('Called with correct parameters', () => {
								sinon.assert.calledWith(fakeGetView, testFilePath, testOptions, testWriteToResponseParameter, testEndResponseParameter);
							});
						});
					});
				});
			});
			describe('setViewConnector', () => {
				let testViewConnector,
					viewConnectorBefore;
				beforeEach(() => {
					testViewConnector = {};
					viewConnectorBefore = fakeController.viewConnector;
				});
				describe('Returns correct value', () => {
					it('Returns \'undefined\' value', () => {
						assert.isUndefined(fakeController.setViewConnector(testViewConnector));
					});
				});
				describe('Modifies attributes properly', () => {
					beforeEach(() => {
						fakeController.setViewConnector(testViewConnector);
					});
					it('Modifies \'viewConnector\' properly', () => {
						assert.equal(fakeController.viewConnector, testViewConnector);
					});
				});
				afterEach(() => {
					fakeController.viewConnector = viewConnectorBefore;
				});
			});
			describe('getAllMiddlewares', () => {
				describe('Returns correct value', () => {
					it('Returned value is an array', () => {
						assert.isArray(BaseController.getAllMiddlewares());
					});
					it('Returned array contains two elements', () => {
						assert.lengthOf(BaseController.getAllMiddlewares(), 2);
					});
				});
				describe('Calls methods', () => {
					beforeEach(() => {
						sinon.spy(BaseController, 'getBaseMiddlewares');
						sinon.spy(BaseController, 'getMiddlewares');
						BaseController.getAllMiddlewares();
					});
					describe('getBaseMiddlewares', () => {
						it('Called once', () => {
							sinon.assert.calledOnce(BaseController.getBaseMiddlewares);
						});
						it('Called with correct parameters', () => {
							sinon.assert.alwaysCalledWith(BaseController.getBaseMiddlewares);
						});
					});
					describe('getMiddlewares', () => {
						it('Called once', () => {
							sinon.assert.calledOnce(BaseController.getMiddlewares);
						});
						it('Called with correct parameters', () => {
							sinon.assert.alwaysCalledWith(BaseController.getMiddlewares);
						});
					});
					afterEach(() => {
						sinon.restore();
					});
				});
			});
			describe('getBaseMiddlewares', () => {
				beforeEach(() => {
					sinon.spy(BaseController.middlewareProvider, 'getMiddleware');
				});
				describe('Returns correct value', () => {
					it('Returned value is an array', () => {
						assert.isArray(BaseController.getBaseMiddlewares());
					});
					it('Returned array contains two elements', () => {
						assert.lengthOf(BaseController.getBaseMiddlewares(), 2);
					});
				});
				describe('Calls methods', () => {
					beforeEach(() => {
						BaseController.getBaseMiddlewares();
					});
					it('Called twice', () => {
						sinon.assert.calledTwice(BaseController.middlewareProvider.getMiddleware);
					});
					it('Firstly called with correct parameters', () => {
						assert.deepEqual(BaseController.middlewareProvider.getMiddleware.getCall(0).args, [
							'CookieParserMiddleware'
						]);
					});
					it('Secondly called with correct parameters', () => {
						assert.deepEqual(BaseController.middlewareProvider.getMiddleware.getCall(1).args, [
							'RouteVariableParserMiddleware'
						]);
					});
				});
			});
			describe('getMiddlewares', () => {
				describe('Returns correct value', () => {
					it('Returned value is an array', () => {
						assert.isArray(BaseController.getMiddlewares());
					});
					it('Returned array is empty', () => {
						assert.lengthOf(BaseController.getMiddlewares(), 0);
					});
				});
			});
			describe('redirect', () => {
				before(() => {
				});
				beforeEach(() => {
					response.end = sinon.fake();
					fakeController.redirect('/redirected');
				});
				it('Response\'s status code is 302', () => {
					assert.equal(response.statusCode, 302);
				});
				it('Did set Location header', () => {
					assert.deepEqual(response.setHeader.getCall(0).args, [
						'Location',
						'/redirected'
					]);
				});
				it('The end methdod called', () => {
					sinon.assert.calledOnce(response.end);
				});
			});
			describe('setCookie', () => {
				let cookie;
				before(() => {
					cookie = require('cookie');
				});
				it('Single', () => {
					fakeController.setCookie('foo', 'bar');
					assert.deepEqual(response.getHeader('Set-Cookie'), [
						'foo=bar'
					]);
				});
				it('Multiple', () => {
					fakeController.setCookie('foo', 'bar');
					fakeController.setCookie('bar', 'foo');
					assert.deepEqual(response.getHeader('Set-Cookie'), [
						cookie.serialize('foo', 'bar'),
						cookie.serialize('bar', 'foo')
					]);
				});
			});
			afterEach(() => {
				sinon.restore();
			});
		});
	});
});