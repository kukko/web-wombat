let assert = require('chai').assert,
	sinon = require('sinon');
sinon.assert.expose(assert);

describe('Middlewares are called properly', () => {
	let { WombatServer, Route, BaseController, BaseMiddleware, MiddlewareProvider } = require('../../index.js'),
		defaultRoutes,
		request,
		response;
	class FakeParameterlessMiddleware extends BaseMiddleware{
		static run(request, response){
			request.runned = true;
		}
	}
	class FakeParameterizedMiddleware extends BaseMiddleware{
		static run(request, response, next, parameters){
			if (parameters.test === true){
				request.ifRunned = true;
			}
			else{
				request.elseRunned = true;
			}
		}
	}
	class FakeController extends BaseController{
	}
	before(() => {
		defaultRoutes = WombatServer.getRoutes();
		WombatServer.setRoutes([
			Route.get("/parameterless", FakeController, "serve", [
				MiddlewareProvider.buildMiddleware(FakeParameterlessMiddleware)
			]),
			Route.get("/trueParameter", FakeController, "serve", [
				MiddlewareProvider.buildMiddleware(FakeParameterizedMiddleware, {
					test: true
				})
			]),
			Route.get("/falseParameter", FakeController, "serve", [
				MiddlewareProvider.buildMiddleware(FakeParameterizedMiddleware, {
					test: false
				})
			])
		]);
	});
	beforeEach(() => {
		request = {
			method: "GET",
			url: "",
			upgrade: false,
			headers: {}
		};
		response = {};
	});
	it('Without parameters', () => {
		request.url = "/parameterless";
		WombatServer.serveRequest(request, response);
		assert.isTrue(request.runned);
	});
	it('With true parameter', () => {
		request.url = "/trueParameter";
		WombatServer.serveRequest(request, response);
		assert.isTrue(request.ifRunned);
	});
	it('With false parameter', () => {
		request.url = "/falseParameter";
		WombatServer.serveRequest(request, response);
		assert.isTrue(request.elseRunned);
	});
	after(() => {
		WombatServer.setRoutes(defaultRoutes);
	});
});