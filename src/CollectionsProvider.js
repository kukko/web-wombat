let { lstatSync, readdirSync } = require("fs");
let { join, dirname } = require("path");

class CollectionsProvider {
	static getCollections() {
		if (typeof this._collections !== "undefined") {
			return this._collections;
		}
		let output = {},
			collectionsDir = this.getCollectionsPath(),
			collections = this.getDirectories(collectionsDir);
		for (let i in collections) {
			let tempCollection = this.loadCollection(collections[i]);
			output[tempCollection.collectionName] = tempCollection;
		}
		return (this._collections = output);
	}
	static getCollectionsPath(){
		return join(
			dirname(require.main.filename),
			"/collections"
		);
	}
	static loadCollection(collectionName){
		return require(join(
			this.getCollectionsPath(),
			collectionName,
			collectionName + ".js"
		));
	}
	static getCollection(collectionName){
		return this.getCollections()[collectionName];
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
