let { BaseController, CollectionsProvider } = require("../../../../index.js");

class MainController extends BaseController {
	insertOne() {
		CollectionsProvider.collections.test
			.createDocument({
				foo: this.request.body.foo
			})
			.then((inserted) => {
				this.response.end(inserted.getId().toString());
			})
			.catch((error) => {
				console.log(error);
			});
	}
	findById() {
		CollectionsProvider.collections.test
			.getDocumentById(this.request.routeVariables.id)
			.then((document) => {
				this.response.end(JSON.stringify(document));
			})
			.catch((error) => {
				console.log(error);
			});
	}
	findAllWithAttribute() {
		CollectionsProvider.collections.test
			.getDocument({
				foo: this.request.body.foo
			})
			.then((documents) => {
				this.response.end(JSON.stringify(documents));
			})
			.catch((error) => {
				console.log(error);
			});
	}
	updateById() {
		CollectionsProvider.getCollection("test")
			.updateDocumentById(this.request.routeVariables.id, {
				foo: this.request.body.foo
			})
			.then((document) => {
				this.response.end(JSON.stringify(document));
			})
			.catch((error) => {
				console.log(error);
			});
	}
	deleteById() {
		CollectionsProvider.getCollection("test")
			.deleteDocumentById(this.request.routeVariables.id)
			.then((deleteDocumentCount) => {
				this.response.end(JSON.stringify(deleteDocumentCount));
			})
			.catch((error) => {
				console.log(error);
			});
	}
}

module.exports = MainController;
