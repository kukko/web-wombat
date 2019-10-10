let assert = require('chai').assert;

describe('Can configure WombatServer.', () => {
	let { WombatServer } = require('../../index.js');
	it('Is start with database connection by default', () => {
		assert.isTrue(WombatServer.connectToDatabase);
	});
	it('Can set to start without database connection', () => {
		WombatServer.withoutDatabase();
		assert.isFalse(WombatServer.connectToDatabase);
	});
	it('Can set to start with database connection', () => {
		WombatServer.withDatabase();
		assert.isTrue(WombatServer.connectToDatabase);
	});
	it('Is listening on port 8888 by default', () => {
		assert.equal(WombatServer.port, 8888);
	});
	it('Can set to listen on port 8080', () => {
		WombatServer.setPort(8080);
		assert.equal(WombatServer.port, 8080);
	});
	it('Is listening on port 443 by default for secure connections', () => {
		assert.equal(WombatServer.securePort, 443);
	});
	it('Can set to listen on port 4443 for secure connections', () => {
		WombatServer.setSecurePort(4443);
		assert.equal(WombatServer.securePort, 4443);
	});
	it('There is no routes setted by default', () => {
		assert.isUndefined(WombatServer.getRoutes());
	});
	it('Can set routes', () => {
		let { Route, BaseController } = require('../../index.js'),
			routes = [
				Route.get('/', BaseController)
			];
		WombatServer.setRoutes(routes);
		assert.equal(WombatServer.getRoutes(), routes);
	});
	it('Listens for secure connections by default', () => {
		assert.isTrue(WombatServer.secureConnection);
	});
	it('Can be setted to not listen for secure connections', () => {
		WombatServer.setUnsecure();
		assert.isFalse(WombatServer.secureConnection);
	});
	it('Can be setted to listen for secure connections', () => {
		WombatServer.setSecure();
		assert.isTrue(WombatServer.secureConnection);
	});
	it('Can set options for secure connections listener', () => {
		let httpsOptions = {
			rejectUnauthorized: false
		};
		WombatServer.setHttpsOptions(httpsOptions);
		assert.equal(WombatServer.getHttpsOptions(), httpsOptions);
	});
});