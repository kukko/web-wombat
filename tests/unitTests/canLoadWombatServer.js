let assert = require('chai').assert;

describe('Can load components from package', () => {
	let webWombat = require("../../index.js");
	it('WombatServer is loaded', () => {
		assert.isFunction(webWombat.WombatServer);
	});
	it('BaseController is loaded', () => {
		assert.isFunction(webWombat.BaseController);
	});
	it('ResourceController is loaded', () => {
		assert.isFunction(webWombat.ResourceController);
	});
	it('WebSocketController is loaded', () => {
		assert.isFunction(webWombat.WebSocketController);
	});
	it('Route is loaded', () => {
		assert.isFunction(webWombat.Route);
	});
	it('RouteGroup is loaded', () => {
		assert.isFunction(webWombat.RouteGroup);
	});
	it('RouteService is loaded', () => {
		assert.isFunction(webWombat.RouteService);
	});
	it('BaseMiddleware is loaded', () => {
		assert.isFunction(webWombat.BaseMiddleware);
	});
	it('MiddlewareProvider is loaded', () => {
		assert.isFunction(webWombat.MiddlewareProvider);
	});
	it('BaseCollection is loaded', () => {
		assert.isFunction(webWombat.BaseCollection);
	});
	it('BaseDocument is loaded', () => {
		assert.isFunction(webWombat.BaseDocument);
	});
	it('BaseField is loaded', () => {
		assert.isFunction(webWombat.BaseField);
	});
	it('Built in field types are loaded', () => {
		assert.isObject(webWombat.fieldTypes);
	});
	it('TextField field type is loaded', () => {
		assert.isFunction(webWombat.fieldTypes.TextField);
	});
	it('CollectionsProvider is loaded', () => {
		assert.isFunction(webWombat.CollectionsProvider);
	});
	it('TemplateInterface is loaded', () => {
		assert.isFunction(webWombat.TemplateInterface);
	});
	it('Built in template connectors are loaded', () => {
		assert.isObject(webWombat.templateConnectors);
	});
	it('Blade template connector is loaded', () => {
		assert.isFunction(webWombat.templateConnectors.BladeConnector);
	});
	it('Handlebars template connector is loaded', () => {
		assert.isFunction(webWombat.templateConnectors.HandlebarsConnector);
	});
	it('HTML template connector is loaded', () => {
		assert.isFunction(webWombat.templateConnectors.HTMLConnector);
	});
	it('Mustache template connector is loaded', () => {
		assert.isFunction(webWombat.templateConnectors.MustacheConnector);
	});
	it('Pug template connector is loaded', () => {
		assert.isFunction(webWombat.templateConnectors.PugConnector);
	});
	it('FormBuilder is loaded', () => {
		assert.isFunction(webWombat.FormBuilder);
	});
	it('AuthenticationService is loaded', () => {
		assert.isFunction(webWombat.AuthenticationService);
	});
	it('AuthenticationSourceInterface is loaded', () => {
		assert.isFunction(webWombat.AuthenticationSourceInterface);
	});
	it('Built in authentication sources are loaded', () => {
		assert.isObject(webWombat.authenticationSources);
	});
	it('Database authentication source is loaded', () => {
		assert.isFunction(webWombat.authenticationSources.DatabaseAuthenticationSource);
	});
	it('Memory authentication source is loaded', () => {
		assert.isFunction(webWombat.authenticationSources.MemoryAuthenticationSource);
	});
});