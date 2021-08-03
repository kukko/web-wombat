let {
	ResourceController,
	CollectionsProvider
} = require("../../../../../index.js");

class ResourceTestController extends ResourceController {
	getCollection() {
		return CollectionsProvider.getCollections().test;
	}
}

module.exports = ResourceTestController;
