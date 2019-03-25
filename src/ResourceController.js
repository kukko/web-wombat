let BaseController = require("./BaseController.js"),
	{ ObjectId } = require("mongodb"),
	RouteService = require("./services/RouteService.js"),
	logger = require("./Logger.js");

class ResourceController extends BaseController {
	setRouteAliasBase(routeAliasBase) {
		this.routeAliasBase = routeAliasBase;
	}
	index() {
		this.getCollection()
			.collection.find({})
			.toArray((error, result) => {
				if (error) {
					logger.log(error);
					this.response.statusCode = 500;
					this.response.end("500");
				}
				let data = {
					elements: result
				};
				this.resourceView("index", data);
			});
	}
	create() {
		this.resourceView("create");
	}
	store() {
		if (
			this.getCollection()
				.getDocument()
				.validateDocument(this.request.body)
		) {
			this.getCollection()
				.createDocument(this.request.body)
				.then((document) => {
					this.redirect(
						RouteService.getRouteByAlias(
							this.routeAliasBase + ".show",
							{
								id: document.getId()
							}
						)
					);
				});
		} else {
			this.response.end("NOT VALID DOCUMENT!");
		}
	}
	show() {
		this.getCollection().collection.findOne(
			{
				_id: new ObjectId(this.request.routeVariables.id)
			},
			(error, result) => {
				if (error) {
					logger.log(error);
					this.response.statusCode = 500;
					this.response.end("500");
				}
				if (result !== null) {
					let data = {
						element: result,
						documentStructure: this.getCollection()
							.getDocument()
							.getStructure(result)
					};
					this.resourceView("show", data);
				} else {
					this.response.end("NOT EXISTING DOCUMENT!");
				}
			}
		);
	}
	edit() {
		this.getCollection().collection.findOne(
			{
				_id: new ObjectId(this.request.routeVariables.id)
			},
			(error, result) => {
				if (error) {
					logger.log(error);
					this.response.statusCode = 500;
					this.response.end("500");
				}
				if (result !== null) {
					let data = {
						element: result,
						documentStructure: this.getCollection()
							.getDocument()
							.getStructure(result)
					};
					this.resourceView("edit", data);
				} else {
					this.response.end("NOT EXISTING DOCUMENT!");
				}
			}
		);
	}
	update() {
		this.getCollection().collection.findOne(
			{
				_id: new ObjectId(this.request.routeVariables.id)
			},
			(error, result) => {
				if (error) {
					logger.log(error);
					this.response.statusCode = 500;
					this.response.end("500");
				}
				if (result !== null) {
					result = this.getCollection().updateDocumentById(
						this.request.routeVariables.id,
						this.request.body
					);
					this.redirect(
						RouteService.getRouteByAlias(
							this.routeAliasBase + ".index"
						)
					);
				} else {
					this.response.end("NOT EXISTING DOCUMENT!");
				}
			}
		);
	}
	destroy() {
		this.getCollection().collection.findOne(
			{
				_id: new ObjectId(this.request.routeVariables.id)
			},
			(error, result) => {
				if (error) {
					logger.log(error);
					this.response.statusCode = 500;
					this.response.end("500");
				}
				if (result !== null) {
					let deleteResult = this.getCollection()
						.deleteDocumentById(this.request.routeVariables.id)
						.then((deletedRowCnt) => {
							if (deletedRowCnt > 0) {
								this.redirect(
									RouteService.getRouteByAlias(
										this.routeAliasBase + ".index"
									)
								);
							} else {
								this.response.end("CAN'T DELETE!");
							}
						});
				} else {
					this.response.end("NOT EXISTING DOCUMENT!");
				}
			}
		);
	}
	resourceView(viewName, data = {}) {
		if (typeof data.documentStructure === "undefined") {
			data.documentStructure = this.getCollection()
				.getDocument()
				.getStructure();
		}
		this.view(
			"resource/" + this.constructor.name + "/" + viewName,
			data
		).catch((error) => {
			let { resolve, join } = require("path");
			this.view(
				resolve(
					__dirname,
					join("resources", "views", "resource", viewName)
				),
				data
			).catch((error) => {
				logger.log(error);
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
