let { Route } = require('../../../index.js');

module.exports = [
	Route.resources('/test', require('../controllers/ResourceTestController/ResourceTestController.js'))
];