let assert = require('chai').assert;

describe('Can load components from package', () => {
	let webWombat = require("../../index.js");
	it('WombatServer is loaded', () => {
		assert.typeOf(webWombat.WombatServer, "function");
	});
	it('BaseController is loaded', () => {
		assert.typeOf(webWombat.BaseController, "function");
	});
	it('ResourceController is loaded', () => {
		assert.typeOf(webWombat.ResourceController, "function");
	});
	it('WebSocketController is loaded', () => {
		assert.typeOf(webWombat.WebSocketController, "function");
	});
	it('Route is loaded', () => {
		assert.typeOf(webWombat.Route, "function");
	});
	it('RouteGroup is loaded', () => {
		assert.typeOf(webWombat.RouteGroup, "function");
	});
	it('RouteService is loaded', () => {
		assert.typeOf(webWombat.RouteService, "function");
	});
	it('BaseMiddleware is loaded', () => {
		assert.typeOf(webWombat.BaseMiddleware, "function");
	});
	it('MiddlewareProvider is loaded', () => {
		assert.typeOf(webWombat.MiddlewareProvider, "function");
	});
	it('BaseCollection is loaded', () => {
		assert.typeOf(webWombat.BaseCollection, "function");
	});
	it('BaseDocument is loaded', () => {
		assert.typeOf(webWombat.BaseDocument, "function");
	});
	it('BaseField is loaded', () => {
		assert.typeOf(webWombat.BaseField, "function");
	});
	it('Built in field types are loaded', () => {
		assert.typeOf(webWombat.fieldTypes, "object");
	});
	it('TextField field type is loaded', () => {
		assert.typeOf(webWombat.fieldTypes.TextField, "function");
	});
	it('CollectionsProvider is loaded', () => {
		assert.typeOf(webWombat.CollectionsProvider, "function");
	});
	it('TemplateInterface is loaded', () => {
		assert.typeOf(webWombat.TemplateInterface, "function");
	});
	it('Built in template connectors are loaded', () => {
		assert.typeOf(webWombat.templateConnectors, "object");
	});
	it('Blade template connector is loaded', () => {
		assert.typeOf(webWombat.templateConnectors.BladeConnector, "function");
	});
	it('Handlebars template connector is loaded', () => {
		assert.typeOf(webWombat.templateConnectors.HandlebarsConnector, "function");
	});
	it('HTML template connector is loaded', () => {
		assert.typeOf(webWombat.templateConnectors.HTMLConnector, "function");
	});
	it('Mustache template connector is loaded', () => {
		assert.typeOf(webWombat.templateConnectors.MustacheConnector, "function");
	});
	it('Pug template connector is loaded', () => {
		assert.typeOf(webWombat.templateConnectors.PugConnector, "function");
	});
	it('FormBuilder is loaded', () => {
		assert.typeOf(webWombat.FormBuilder, "function");
	});
	it('AuthenticationService is loaded', () => {
		assert.typeOf(webWombat.AuthenticationService, "function");
	});
	it('AuthenticationSourceInterface is loaded', () => {
		assert.typeOf(webWombat.AuthenticationSourceInterface, "function");
	});
	it('Built in authentication sources are loaded', () => {
		assert.typeOf(webWombat.authenticationSources, "object");
	});
	it('Database authentication source is loaded', () => {
		assert.typeOf(webWombat.authenticationSources.DatabaseAuthenticationSource, "function");
	});
	it('Memory authentication source is loaded', () => {
		assert.typeOf(webWombat.authenticationSources.MemoryAuthenticationSource, "function");
	});
});