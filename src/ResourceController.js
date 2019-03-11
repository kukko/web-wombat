let BaseController = require("./BaseController.js"),
	{ ObjectId } = require("mongodb");

class ResourceController extends BaseController {
	setRouteAliasBase(routeAliasBase) {
		this.routeAliasBase = routeAliasBase;
	}
	index() {
		this.getCollection()
			.collection.find({})
			.toArray((error, result) => {
				if (error) {
					console.log(error);
					this.response.statusCode = 500;
					this.response.end("500");
				}
				let data = {
					elements: result
				};
				this.resourceView("index", data);
			});
	}
	create() {}
	store() {}
	show() {}
	edit() {
		this.getCollection().collection.findOne(
			{
				_id: ObjectId(this.request.routeVariables.id)
			},
			(error, result) => {
				if (error) {
					console.log(error);
					this.response.statusCode = 500;
					this.response.end("500");
				}
				let data = {
					element: result,
					documentStructure: this.getCollection().getDocument().getStructure(result)
				};
				this.resourceView("edit", data);
			}
		);
	}
	update() {}
	destroy() {}
	resourceView(viewName, data) {
		this.view(
			"resource/" + this.constructor.name + "/" + viewName,
			data
		).catch(error => {
			let { resolve, join } = require("path");
			this.view(
				resolve(
					__dirname,
					join("resources", "views", "resource", viewName)
				),
				data
			).catch(error => {
				console.log(error);
				this.response.end("MISSING RESOURCE VIEW!");
			});
		});
	}
	view(filePath, options, writeToResponse, endResponse) {
		options.routeAliasBase = this.routeAliasBase;
		return super.view(filePath, options, writeToResponse, endResponse);
	}
	getCollection() {
		throw new Error(
			"Not implemented 'getCollection' attribute getter method in class: " +
				this.constructor.name +
				"!"
		);
	}
}

module.exports = ResourceController;
