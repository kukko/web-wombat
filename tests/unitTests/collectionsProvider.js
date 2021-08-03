let assert = require('chai').assert,
	sinon = require('sinon'),
	proxyquire = require('proxyquire').noCallThru();

describe('CollectionsProvider', () => {
	let CollectionsProvider;
	beforeEach(() => {
		CollectionsProvider = require('../../index.js').CollectionsProvider;
	});
	it('Can be loaded', () => {
		assert.isFunction(CollectionsProvider);
	});
	describe('Have basic documented static 0methods', () => {
		it('getCollectionsPath', () => {
			assert.isFunction(CollectionsProvider.getCollectionsPath);
		});
		it('loadCollection', () => {
			assert.isFunction(CollectionsProvider.loadCollection);
		});
		it('getCollection', () => {
			assert.isFunction(CollectionsProvider.getCollection);
		});
		it('isDirectory', () => {
			assert.isFunction(CollectionsProvider.isDirectory);
		});
		it('getDirectories', () => {
			assert.isFunction(CollectionsProvider.getDirectories);
		});
	});
	describe('Methods works as expected', () => {
		describe('getCollections', () => {
			let getDirectoriesBefore,
				loadCollectionBefore,
				testCollections,
				collectionsBefore;
			beforeEach(() => {
				sinon.spy(CollectionsProvider, 'getCollectionsPath');
				getDirectoriesBefore = CollectionsProvider.getDirectories;
				testCollections = {
					'fooCollection': 'foo',
					'barCollection': 'bar'
				};
				CollectionsProvider.getDirectories = sinon.fake((collectionsDir) => {
					return Object.keys(testCollections);
				});
				loadCollectionBefore = CollectionsProvider.loadCollection;
				CollectionsProvider.loadCollection = sinon.fake((collectionName) => {
					return {
						collectionName: testCollections[collectionName]
					};
				});
				collectionsBefore = CollectionsProvider._collections;
			});
			describe('Collections was not loaded before', () => {
				describe('Returns correct value', () => {
					it('Returned value is an object', () => {
						assert.isObject(CollectionsProvider.getCollections());
					});
					it('Returned object have the same number of attributes like the numbers of collections in folder', () => {
						assert.lengthOf(Object.keys(CollectionsProvider.getCollections()), Object.keys(testCollections).length);
					});
					it('Returned object have the same attributes as collection names', () => {
						assert.deepEqual(Object.keys(CollectionsProvider.getCollections()), Object.values(testCollections));
					});
				});
				describe('Calls methods', () => {
					beforeEach(() => {
						CollectionsProvider.getCollections();
					});
					describe('Calls \'getCollectionsPath\' of \'CollectionsProvider\' class', () => {
						it('Called once', () => {
							sinon.assert.calledOnce(CollectionsProvider.getCollectionsPath);
						});
						it('Called with correct parameters', () => {
							sinon.assert.alwaysCalledWith(CollectionsProvider.getCollectionsPath);
						});
					});
					describe('Calls \'getDirectories\' of \'CollectionsProvider\' class', () => {
						it('Called once', () => {
							sinon.assert.calledOnce(CollectionsProvider.getDirectories);
						});
						it('Called with correct parameters', () => {
							sinon.assert.alwaysCalledWith(CollectionsProvider.getDirectories, CollectionsProvider.getCollectionsPath());
						});
					});
					describe('Calls \'loadCollection\' of \'CollectionsProvider\' class', () => {
						it('Called the same times as many collections exists', () => {
							sinon.assert.callCount(CollectionsProvider.loadCollection, Object.keys(testCollections).length);
						});
						it('Always called with correct parameters', () => {
							for (let i = 0; i < Object.keys(testCollections).length; i++){
								assert.deepEqual(CollectionsProvider.loadCollection.getCall(i).args, [
									CollectionsProvider.getDirectories()[i]
								]);
							}
						});
					});
				});
			});
			describe('Collections was loaded before', () => {
				beforeEach(() => {
					CollectionsProvider.getCollections();
					sinon.reset();
				});
				describe('Returns correct value', () => {
					it('Returned value is an object', () => {
						assert.isObject(CollectionsProvider.getCollections());
					});
					it('Returned object have the same number of attributes like the numbers of collections in folder', () => {
						assert.lengthOf(Object.keys(CollectionsProvider.getCollections()), Object.keys(testCollections).length);
					});
					it('Returned object have the same attributes as collection names', () => {
						assert.deepEqual(Object.keys(CollectionsProvider.getCollections()), Object.values(testCollections));
					});
				});
				describe('Calls methods', () => {
					beforeEach(() => {
						CollectionsProvider.getCollections();
					});
					describe('Calls \'getCollectionsPath\' of \'CollectionsProvider\' class', () => {
						it('Called once', () => {
							sinon.assert.notCalled(CollectionsProvider.getCollectionsPath);
						});
					});
					describe('Calls \'getDirectories\' of \'CollectionsProvider\' class', () => {
						it('Called once', () => {
							sinon.assert.notCalled(CollectionsProvider.getDirectories);
						});
					});
					describe('Calls \'loadCollection\' of \'CollectionsProvider\' class', () => {
						it('Called the same times as many collections exists', () => {
							sinon.assert.notCalled(CollectionsProvider.loadCollection);
						});
					});
				});
			});
			afterEach(() => {
				CollectionsProvider._collections = collectionsBefore;
				CollectionsProvider.getDirectories = getDirectoriesBefore;
				CollectionsProvider.loadCollection = loadCollectionBefore;
				sinon.restore();
			});
		});
		describe('getCollectionsPath', () => {
			describe('Returns correct value', () => {
				it('Returns string', () => {
					assert.isString(CollectionsProvider.getCollectionsPath());
				});
				it('Returned string is correct', () => {
					assert.isTrue(CollectionsProvider.getCollectionsPath().endsWith(require('path').join('/', 'collections')));
				});
			});
			describe('Calls methods', () => {
				let fakeJoin,
					fakeDirname,
					fakeDirnameReturnValue;
				beforeEach(() => {
					fakeJoin = sinon.fake(() => {
					});
					fakeDirnameReturnValue = 'foo';
					fakeDirname = sinon.fake(() => {
						return fakeDirnameReturnValue;
					});
					CollectionsProvider = proxyquire.load('../../src/CollectionsProvider.js', {
						path: {
							join: fakeJoin,
							dirname: fakeDirname
						}
					});
					CollectionsProvider.getCollectionsPath();
				});
				describe('Calls \'dirname\' method of \'path\' package', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(fakeDirname);
					});
					it('Called with correct parameters', () => {
						sinon.assert.alwaysCalledWith(fakeDirname, require.main.filename);
					});
				});
				describe('Calls \'join\' method of \'path\' package', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(fakeJoin);
					});
					it('Called with correct parameters', () => {
						sinon.assert.alwaysCalledWith(fakeJoin, fakeDirnameReturnValue, '/collections');
					});
				});
			});
		});
		describe('loadCollection', () => {
			let testCollectionName,
				getCollectionsPathBefore,
				fakeGetCollectionsPath,
				fakeGetCollectionsPathReturnValue,
				fakeJoin,
				fakeJoinReturnValue,
				testCollection;
			beforeEach(() => {
				let proxyquireOverrides = {};
				fakeJoinReturnValue = 'bar';
				fakeJoin = sinon.fake(() => {
					return fakeJoinReturnValue;
				});
				proxyquireOverrides['path'] = {
					join: fakeJoin
				};
				testCollection = {};
				testCollectionName = 'foo-collection';
				proxyquireOverrides[fakeJoinReturnValue] = testCollection;
				CollectionsProvider = proxyquire.load('../../src/CollectionsProvider.js', proxyquireOverrides);
				fakeGetCollectionsPathReturnValue = 'bar';
				fakeGetCollectionsPath = sinon.fake(() => {
					return fakeGetCollectionsPathReturnValue;
				});
				getCollectionsPathBefore = CollectionsProvider.getCollectionsPath;
				CollectionsProvider.getCollectionsPath = fakeGetCollectionsPath;
			});
			describe('Returns correct value', () => {
				it('Returned value is an object', () => {
					assert.isObject(CollectionsProvider.loadCollection(testCollectionName));
				});
				it('Returned the loaded module', () => {
					assert.equal(CollectionsProvider.loadCollection(testCollectionName), testCollection);
				});
			});
			describe('Calls methods', () => {
				beforeEach(() => {
					CollectionsProvider.loadCollection(testCollectionName);
				});
				describe('Calls \'getCollectionsPath\' of \'CollectionsProvider\' class', () => {
					it('Called the same times as many collections exists', () => {
						sinon.assert.calledOnce(CollectionsProvider.getCollectionsPath);
					});
					it('Called with correct parameters', () => {
						sinon.assert.alwaysCalledWith(CollectionsProvider.getCollectionsPath);
					});
				});
				describe('Calls \'join\' method of \'path\' package', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(fakeJoin);
					});
					it('Called with correct parameters', () => {
						sinon.assert.alwaysCalledWithExactly(fakeJoin, fakeJoinReturnValue, testCollectionName, testCollectionName + '.js');
					});
				});
			});
			afterEach(() => {
				CollectionsProvider.getCollectionsPathBefore = getCollectionsPathBefore;
			});
		});
		describe('getCollection', () => {
			let testCollectionName,
				testCollection,
				testNonExistentCollectionName,
				getCollectionsBefore,
				fakeGetCollectionsReturnValue;
			beforeEach(() => {
				testCollectionName = 'foo-collection';
				testNonExistentCollectionName = testCollectionName + 'bar';
				getCollectionsBefore = CollectionsProvider.getCollections;
				fakeGetCollectionsReturnValue = [];
				testCollection = {};
				fakeGetCollectionsReturnValue[testCollectionName] = testCollection;
				CollectionsProvider.getCollections = sinon.fake(() => {
					return fakeGetCollectionsReturnValue;
				});
			});
			describe('Returns correct value', () => {
				describe('Collection exists', () => {
					it('Returns object', () => {
						assert.isObject(CollectionsProvider.getCollection(testCollectionName));
					});
					it('Returned object is correct', () => {
						assert.equal(CollectionsProvider.getCollection(testCollectionName), testCollection);
					});
				});
				describe('Collection not exists', () => {
					it('Returns undefined', () => {
						assert.isUndefined(CollectionsProvider.getCollection(testNonExistentCollectionName));
					});
				});
			});
			describe('Calls methods', () => {
				describe('Calls \'getCollection\' method of \'CollectionsProvider\'', () => {
					describe('Collection exists', () => {
						beforeEach(() => {
							CollectionsProvider.getCollection(testCollectionName);
						});
						it('Called once', () => {
							sinon.assert.calledOnce(CollectionsProvider.getCollections);
						});
						it('Called with correct parameters', () => {
							assert.deepEqual(CollectionsProvider.getCollections.getCall(0).args, [
							]);
						});
					});
					describe('Collection not exists', () => {
						beforeEach(() => {
							CollectionsProvider.getCollection(testNonExistentCollectionName);
						});
						it('Called once', () => {
							sinon.assert.calledOnce(CollectionsProvider.getCollections);
						});
						it('Called with correct parameters', () => {
							assert.deepEqual(CollectionsProvider.getCollections.getCall(0).args, [
							]);
						});
					});
				});
			});
			afterEach(() => {
				CollectionsProvider.getCollections = getCollectionsBefore;
			});
		});
		describe('isDirectory', () => {
			let testSource,
				testParentFolder,
				testCollectionFolder,
				fakeJoin,
				fakeJoinReturnValue,
				fakeIsDirectory,
				fakeIsDirectoryReturnValue,
				fakeLstatSync,
				fakeLstatSyncReturnValue,
				fakeReaddirSync,
				fakeReaddirSyncReturnValue;
			beforeEach(() => {
				testParentFolder = 'foo';
				testCollectionFolder = 'bar';
				testSource = {
					parentFolder: testParentFolder,
					collectionFolder: testCollectionFolder
				};
				fakeJoinReturnValue = 'foo';
				fakeJoin = sinon.fake(() => {
					return fakeJoinReturnValue;
				});
				fakeIsDirectory = sinon.fake(() => {
					return fakeIsDirectoryReturnValue;
				});
				fakeLstatSync = sinon.fake(() => {
					return {
						isDirectory: fakeIsDirectory
					};
				});
				fakeReaddirSync = sinon.fake(() => {
					return fakeReaddirSyncReturnValue;
				});
				CollectionsProvider = proxyquire.load('../../src/CollectionsProvider.js', {
					path: {
						join: fakeJoin
					},
					fs: {
						lstatSync: fakeLstatSync,
						readdirSync: fakeReaddirSync
					}
				});
			});
			describe('Returns correct value', () => {
				describe('Source is a directory', () => {
					beforeEach(() => {
						fakeIsDirectoryReturnValue = true;
					});
					it('Returns true', () => {
						assert.isTrue(CollectionsProvider.isDirectory(testSource));
					});
				});
				describe('Source is not a directory', () => {
					beforeEach(() => {
						fakeIsDirectoryReturnValue = false;
					});
					it('Returns false', () => {
						assert.isFalse(CollectionsProvider.isDirectory(testSource));
					});
				});
			});
			describe('Calls methods', () => {
				beforeEach(() => {
					CollectionsProvider.isDirectory(testSource);
				});
				describe('Calls \'join\' method of \'path\' package', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(fakeJoin);
					});
					it('Called with correct parameters', () => {
						assert.deepEqual(fakeJoin.getCall(0).args, [
							testParentFolder,
							testCollectionFolder
						]);
					});
				});
				describe('Calls \'lstatSync\' method of \'fs\' package', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(fakeLstatSync);
					});
					it('Called with correct parameters', () => {
						assert.deepEqual(fakeLstatSync.getCall(0).args, [
							fakeJoinReturnValue
						]);
					});
				});
				describe('Calls \'isDirectory\' method of the result of \'lstatSync\' method', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(fakeIsDirectory);
					});
					it('Called with correct parameters', () => {
						assert.deepEqual(fakeIsDirectory.getCall(0).args, [
						]);
					});
				});
			});
		});
		describe('getDirectories', () => {
			let testSource,
				testParentFolder,
				testCollectionFolder,
				fakeIsDirectory,
				fakeIsDirectoryReturnValue,
				fakeReaddirSync,
				fakeReaddirSyncReturnValue;
			beforeEach(() => {
				testSource = 'foo';
				testParentFolder = 'foo';
				testCollectionFolder = 'bar';
				fakeReaddirSync = sinon.fake(() => {
					return fakeReaddirSyncReturnValue;
				});
				CollectionsProvider = proxyquire.load('../../src/CollectionsProvider.js', {
					fs: {
						readdirSync: fakeReaddirSync
					}
				});
				fakeIsDirectory = sinon.fake(() => {
					return fakeIsDirectoryReturnValue;
				});
				CollectionsProvider.isDirectory = fakeIsDirectory;
			});
			describe('Returns correct value', () => {
				describe('Everything in folder is directory', () => {
					beforeEach(() => {
						fakeReaddirSyncReturnValue = [
							'FooCollection'
						];
						fakeIsDirectoryReturnValue = true;
					});
					describe('Returns correct value', () => {
						it('Returned value is array', () => {
							assert.isArray(CollectionsProvider.getDirectories(testSource));
						});
						it('Returned array length is correct', () => {
							assert.lengthOf(CollectionsProvider.getDirectories(testSource), 1);
						});
						it('Returned array elements is correct', () => {
							assert.deepEqual(CollectionsProvider.getDirectories(testSource), fakeReaddirSyncReturnValue);
						});
					});
					describe('Calls methods', () => {
						beforeEach(() => {
							sinon.spy(Array.prototype, 'map');
							sinon.spy(Array.prototype, 'filter');
							sinon.spy(CollectionsProvider, 'transformFolder');
							sinon.spy(CollectionsProvider, 'extractCollectionsFolder');
							CollectionsProvider.getDirectories(testSource);
						});
						describe('Calls \'readdirSync\' method of \'fs\' package', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeReaddirSync);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(fakeReaddirSync.getCall(0).args, [
									testSource
								]);
							});
						});
						describe('Calls \'map\' method on \'Array\'', () => {
							it('Called twice', () => {
								sinon.assert.calledTwice(Array.prototype.map);
							});
							it('Called with one parameter at the first call', () => {
								assert.lengthOf(Array.prototype.map.getCall(0).args, 1);
							});
							it('First parameter at the first call is a function', () => {
								assert.isFunction(Array.prototype.map.getCall(0).args[0]);
							});
							it('Called with correct parameters at the second call', () => {
								assert.deepEqual(Array.prototype.map.getCall(1).args, [
									CollectionsProvider.extractCollectionsFolder
								]);
							});
						});
						describe('Calls \'transformFolder\' method of \'CollectionsProvider\'', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(CollectionsProvider.transformFolder);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(CollectionsProvider.transformFolder.getCall(0).args, [
									testSource
								]);
							});
						});
						describe('Calls \'filter\' method on \'Array\'', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(Array.prototype.filter);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(Array.prototype.filter.getCall(0).args, [
									fakeIsDirectory
								]);
							});
						});
						describe('Calls \'extractCollectionsFolder\' method of \'CollectionsProvider\'', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(CollectionsProvider.extractCollectionsFolder);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(CollectionsProvider.extractCollectionsFolder.getCall(0).args, [
									CollectionsProvider.transformFolder(testSource)(fakeReaddirSyncReturnValue[0]),
									0,
									[
										CollectionsProvider.transformFolder(testSource)(fakeReaddirSyncReturnValue[0])
									]
								]);
							});
						});
						afterEach(() => {
							sinon.restore();
						});
					});
				});
			});
		});
	});
});