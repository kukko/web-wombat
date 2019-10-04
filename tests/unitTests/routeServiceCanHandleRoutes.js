let assert = require('chai').assert;

describe('RouteService is initialized properly', () => {
	let RouteService;
	before(() => {
		RouteService = require("../../index.js").RouteService;
	});
	it('There are no routes defined by default', () => {
		assert.isUndefined(RouteService.getRoutes());
	});
});

describe('RouteService can handle routes', () => {
	let RouteService,
		{ Route } = require('../../index.js'),
		homeRoute = Route.get('/', () => {}).as('home'),
		profileRoute = Route.get('/user/{username}').as('profile'),
		routes = [
			homeRoute,
			profileRoute
		];
	before(() => {
		RouteService = require("../../index.js").RouteService;
		RouteService.setRoutes(routes);
	});
	it('Can set routes', () => {
		RouteService.setRoutes(routes);
		assert.equal(RouteService.getRoutes(), routes);
	});
	it('Can find route by request type and URL', () => {
		assert.equal(RouteService.getRoute({
			method: 'GET',
			url: '/',
			upgrade: false
		}), homeRoute);
	});
	it('Can find route by alias', () => {
		assert.equal(RouteService.getRouteByAlias('home'), homeRoute);
	});
	it('Can build URL with parameters', () => {
		let username = 'wombat';
		assert.equal(RouteService.getRouteByAlias('profile', {
			username: username
		}), '/user/' + username);
	});
	after(() => {
		RouteService.setRoutes();
	});
});