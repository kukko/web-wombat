let assert = require('chai').assert,
	sinon = require('sinon');
sinon.assert.expose(assert);

describe('BaseController have basic documented methods', () => {
	let BaseController;
	before(() => {
		BaseController = require('../../index.js').BaseController;
	});
	it('Have serve method', () => {
		assert.isFunction(BaseController.prototype.serve);
	});
	it('Have view method', () => {
		assert.isFunction(BaseController.prototype.view);
	});
	it('Have static getMiddleware method', () => {
		assert.isFunction(BaseController.getMiddleware);
	});
	it('Have setViewConnector method', () => {
		assert.isFunction(BaseController.prototype.setViewConnector);
	});
	it('Have redirect method', () => {
		assert.isFunction(BaseController.prototype.redirect);
	});
});

describe('BaseController have basic documented attributes', () => {
	let BaseController;
	before(() => {
		BaseController = require('../../index.js').BaseController;
	});
	it('Have MiddlewareProvider', () => {
		assert.isFunction(BaseController.middlewareProvider);
	});
	it('Have ViewProvider', () => {
		assert.isFunction(BaseController.ViewProvider);
	});
});

describe('BaseController abstract methods work as expected.', () => {
	let BaseController = require('../../index.js').BaseController,
		{ logger } = require('../../index.js'),
		fakeController,
		spy;
	class FakeController extends BaseController{
	}
	before(() => {
		fakeController = new FakeController();
	});
	beforeEach(() => {
		sinon.spy(logger, 'warn');
	});
	it('Method serve returns null', () => {
		assert.isUndefined(fakeController.serve());
	});
	it('Method serve works as expected', () => {
		fakeController.serve();
		sinon.assert.calledOnce(logger.warn);
	});
	afterEach(() => {
		logger.warn.restore();
	});
});