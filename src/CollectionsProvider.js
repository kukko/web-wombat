let { lstatSync, readdirSync } = require("fs");
let { join, dirname } = require("path");

class CollectionsProvider {
	static get collections() {
		if (typeof this._collections !== "undefined") {
			return this._collections;
		}
		let output = {},
			collectionsDir = join(
				dirname(require.main.filename),
				"/collections"
			),
			collections = this.getDirectories(collectionsDir);
		for (let i in collections) {
			let tempCollection = require(join(
				collectionsDir,
				collections[i],
				collections[i] + ".js"
			));
			output[tempCollection.collectionName] = tempCollection;
		}
		return (this._collections = output);
	}
	static getCollection(collectionName) {
		return this.collections[collectionName];
	}
	static isDirectory(source) {
		return lstatSync(
			join(source.parentFolder, source.collectionFolder)
		).isDirectory();
	}
	static getDirectories(source) {
		return readdirSync(source)
			.map((folder) => {
				return {
					parentFolder: source,
					collectionFolder: folder
				};
			})
			.filter(this.isDirectory)
			.map((collection) => {
				return collection.collectionFolder;
			});
	}
}

module.exports = CollectionsProvider;
