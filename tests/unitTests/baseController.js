let assert = require('chai').assert,
	sinon = require('sinon');
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
		it('static getMiddleware', () => {
			assert.isFunction(BaseController.getMiddleware);
		});
		it('setViewConnector', () => {
			assert.isFunction(BaseController.prototype.setViewConnector);
		});
		it('redirect', () => {
			assert.isFunction(BaseController.prototype.redirect);
		});
	});
	describe('Have basic documented attributes', () => {
		it('cookie', () => {
			assert.isObject(BaseController.cookie);
		});
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
				headers: {}
			};
			response = {};
			fakeController = new FakeControllerClass(request, response);
		});
		describe('Abstract methods', () => {
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