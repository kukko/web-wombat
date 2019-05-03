class MiddlewareProvider {
	static runMiddlewares(request, response, callback, middlewares, i = 0) {
		if (i < middlewares.length) {
			return middlewares[i].run(request, response, () => {
				return this.runMiddlewares(
					request,
					response,
					callback,
					middlewares,
					i + 1
				);
			});
		} else {
			return callback(request, response);
		}
	}
	static getWebMiddlewares() {
		return [
			this.getMiddleware("BodyParserMiddleware"),
			this.getMiddleware("FormMethodParserMiddleware")
		];
	}
	static getMiddleware(name) {
		if (typeof this.middlewares[name] !== "undefined") {
			return this.middlewares[name];
		}
		let { existsSync } = require("fs"),
			{ join, dirname } = require("path"),
			middlewareRoute = join(
				__dirname,
				"./middlewares",
				name,
				name + ".js"
			);
		if (existsSync(middlewareRoute)) {
			return (this.middlewares[name] = require(middlewareRoute));
		} else {
			middlewareRoute = join(
				dirname(require.main.filename),
				"middlewares",
				name,
				name + ".js"
			);
			if (existsSync(middlewareRoute)) {
				return (this.middlewares[name] = require(middlewareRoute));
			} else {
				throw new Error("Middleware (" + name + ") missing!");
			}
		}
	}
	static getAllMiddlewares(reload = false){
		if (typeof this.middlewares === "undefined" || reload){
			this.loadMiddlewares();
		}
		return this.middlewares;
	}
	static loadMiddlewares(){
		this.middlewares = {};
		let { resolve, join } = require("path"),
			{ readdirSync, lstatSync } = require("fs"),
			middlewaresFolder = resolve(__dirname, "./middlewares"),
			middlewareFolders = readdirSync(middlewaresFolder)
				.map((folder) => {
					return {
						parentFolder: middlewaresFolder,
						middlewareFolder: folder
					};
				})
				.filter((source) => {
					return lstatSync(
						join(source.parentFolder, source.middlewareFolder)
					).isDirectory();
				})
				.map((collection) => {
					return collection.middlewareFolder;
				});

		for (let i in middlewareFolders) {
			let middlewareName = middlewareFolders[i];
			this.middlewares[middlewareName] = require(join(
				middlewaresFolder,
				middlewareName,
				middlewareName + ".js"
			));
		}
		return this;
	}
}

MiddlewareProvider.loadMiddlewares();

module.exports = MiddlewareProvider;
