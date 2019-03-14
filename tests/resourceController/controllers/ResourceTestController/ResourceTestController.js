let {
	ResourceController,
	CollectionsProvider
} = require("../../../../index.js");

class ResourceTestController extends ResourceController {
	getCollection() {
		return CollectionsProvider.collections.test;
	}
}

module.exports = ResourceTestController;
