let BaseController = require("./BaseController.js"),
	{ ObjectId } = require("mongodb"),
	RouteService = require('./services/RouteService.js');

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
	show() {
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
				if (result !== null){
					let data = {
						element: result,
						documentStructure: this.getCollection().getDocument().getStructure(result)
					};
					this.resourceView("show", data);
				}
				else{
					this.response.end('NOT EXISTING DOCUMENT!');
				}
			}
		);
	}
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
				if (result !== null){
					let data = {
						element: result,
						documentStructure: this.getCollection().getDocument().getStructure(result)
					};
					this.resourceView("edit", data);
				}
				else{
					this.response.end('NOT EXISTING DOCUMENT!');
				}
			}
		);
	}
	update() {
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
				if (result !== null){
					result = this.getCollection().updateDocument(this.request.routeVariables.id, this.request.body);
					this.redirect(RouteService.getRouteByAlias(this.routeAliasBase + '.index'));
				}
				else{
					this.response.end('NOT EXISTING DOCUMENT!');
				}
			}
		);
	}
	destroy() {
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
				if (result !== null){
					let deleteResult = this.getCollection().deleteDocument(this.request.routeVariables.id).then((rowDeleted) => {
						if (rowDeleted){
							this.redirect(RouteService.getRouteByAlias(this.routeAliasBase + '.index'));
						}
						else{
							this.response.end('CAN\'T DELETE!');
						}
					});
				}
				else{
					this.response.end('NOT EXISTING DOCUMENT!');
				}
			}
		);
	}
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
