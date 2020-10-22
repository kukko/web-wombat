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
    });
});