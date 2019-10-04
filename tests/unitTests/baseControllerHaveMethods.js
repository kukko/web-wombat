let assert = require('chai').assert;

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