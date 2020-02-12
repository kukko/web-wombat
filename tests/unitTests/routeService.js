let assert = require('chai').assert;

describe('RouteService', () => {
	let { RouteService, Route, RouteGroup } = require("../../index.js"),
		defaultRoutes = RouteService.getRoutes();
	describe('Methods works as expected', () => {
		let testRoute = Route.get("/");
		describe('getRoutes', () => {
			it('Returns undefined by default', () => {
				assert.isUndefined(RouteService.getRoutes());
			});
			it('Returns which is setted through setRoutes', () => {
				RouteService.setRoutes([
					testRoute
				]);
				assert.isArray(RouteService.getRoutes(), [
					testRoute
				]);
			});
		});
		it('setRoutes', () => {
			RouteService.setRoutes([
				testRoute
			]);
			assert.deepEqual(RouteService.getRoutes(), [
				testRoute
			]);
		});
		describe('getRoute', () => {
			describe('Different URL-s with different request methods', () => {
				beforeEach(() => {
					RouteService.setRoutes([
						Route.get("/getRequest"),
						Route.post("/postRequest"),
						[
							Route.get("/getRequestFromArray")
						],
						[
							Route.post("/getRequestFromArray")
						]
					]);
				});
				it('Route for GET request found', () => {
					assert.deepEqual(RouteService.getRoute({
						method: "GET",
						url: "/getRequest",
						upgrade: false
					}), Route.get("/getRequest"));
				});
				it('Route for POST request found', () => {
					assert.deepEqual(RouteService.getRoute({
						method: "POST",
						url: "/postRequest",
						upgrade: false
					}), Route.post("/postRequest"));
				});
				it('Route from array', () => {
					assert.deepEqual(RouteService.getRoute({
						method: "POST",
						url: "/getRequestFromArray",
						upgrade: false
					}), Route.post("/getRequestFromArray"));
				});
			});
			describe('Identific URL-s with different request methods', () => {
				beforeEach(() => {
					RouteService.setRoutes([
						Route.get("/foo"),
						Route.post("/foo")
					]);
				});
				it('Route for GET request found', () => {
					assert.deepEqual(RouteService.getRoute({
						method: "GET",
						url: "/foo",
						upgrade: false
					}), Route.get("/foo"));
				});
				it('Route for POST request found', () => {
					assert.deepEqual(RouteService.getRoute({
						method: "POST",
						url: "/foo",
						upgrade: false
					}), Route.post("/foo"));
				});
			});
		});
		describe('trimURL', () => {
			it('URL starts with slash', () => {
				assert.equal(RouteService.trimURL("home/"), "home");
			});
			it('URL ends with slash', () => {
				assert.equal(RouteService.trimURL("/home"), "home");
			});
			it('URL starts and ends with slash', () => {
				assert.equal(RouteService.trimURL("/home/"), "home");
			});
		});
		describe('getRouteByAlias', () => {
			beforeEach(() => {
				RouteService.setRoutes([
					Route.get("/foo").as("foo"),
					new RouteGroup("/bar", [
						Route.get("/kaboom").as("kaboom")
					]),
					[
						Route.get("/kaboom").as("rootKaboom")
					]
				]);
			});
			it('Can find top level route', () => {
				assert.equal(RouteService.getRouteByAlias("foo"), "/foo");
			});
			it('Can find route in RouteGroup', () => {
				assert.equal(RouteService.getRouteByAlias("kaboom"), "/bar/kaboom");
			});
			it('Can find route in array', () => {
				assert.equal(RouteService.getRouteByAlias("rootKaboom"), "/kaboom");
			});
		});
	});
	afterEach(() => {
		RouteService.setRoutes(defaultRoutes);
	});
});