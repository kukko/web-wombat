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
		],
		defaultRoutes,
		WebWombat;
	before(() => {
		WebWombat = require("../../index.js"),
		RouteService = WebWombat.RouteService;
		defaultRoutes = RouteService.getRoutes();
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
	it('Can build URL with parameters', () => {
		let username = 'wombat';
		assert.equal(RouteService.getRouteByAlias('profile', {
			username: username
		}), '/user/' + username);
	});
	describe('Get route by alias', () => {
		describe('Simple routes', () => {
			it('Can find route by alias', () => {
				assert.equal(RouteService.getRouteByAlias('home'), homeRoute);
			});
		});
		describe('Route groups', () => {
			before(() => {
				let RouteGroup = WebWombat.RouteGroup;
				RouteService.setRoutes([
					new RouteGroup("/subpage", [
						Route.get("/home").as('subHome')
					])
				]);
			});
			it('Can find route by alias', () => {
				assert.equal(RouteService.getRouteByAlias('subHome'), "/subpage/home");
			});
		});
	});
	after(() => {
		RouteService.setRoutes(defaultRoutes);
	});
});