let { assert } = require('chai'),
    sinon = require('sinon');

describe('BaseCollection', () => {
    let BaseCollection;
    before(() => {
        BaseCollection = require('../../index.js').BaseCollection;
    });
    it('Can be loaded', () => {
        assert.isFunction(BaseCollection);
    });
    describe('Have basic documented attributes', () => {
        it('collectionName', () => {
            assert.isObject(Object.getOwnPropertyDescriptor(BaseCollection, 'collectionName'));
        });
        it('collection', () => {
            assert.isObject(Object.getOwnPropertyDescriptor(BaseCollection, 'collection'));
        });
    })
    describe('Have basic documented methods', () => {
        it('create', () => {
            assert.isFunction(BaseCollection.create);
        });
        it('runAfterCreate', () => {
            assert.isFunction(BaseCollection.runAfterCreate);
        });
        it('getDocument', () => {
            assert.isFunction(BaseCollection.getDocument);
        });
        it('createDocument', () => {
            assert.isFunction(BaseCollection.createDocument);
        });
        it('updateDocument', () => {
            assert.isFunction(BaseCollection.updateDocument);
        });
        it('deleteDocument', () => {
            assert.isFunction(BaseCollection.deleteDocument);
        });
    });
    describe('Methods works as expected', () => {
        let FakeCollection;
        beforeEach(() => {
            class FakeCollectionClass extends BaseCollection {
                static get collectionName() {
                    return 'foo';
                }
            };
            FakeCollection = FakeCollectionClass;
        });
        describe('Attribute getters', () => {
            describe('collectionName', () => {
                it('Throws error', (done) => {
                    try {
                        BaseCollection.collectionName;
                    }
                    catch (e) {
                        done();
                    }
                });
                it('Thrown error\'s message is correct', (done) => {
                    try {
                        BaseCollection.collectionName;
                    }
                    catch (e) {
                        assert.equal(e.message, 'Not implemented \'collectionName\' attribute getter method in class: BaseCollection!');
                        done();
                    }
                });
            });
            describe('collection', () => {
                describe('The \'_collection\' attribute have been set', () => {
                    let previousCollection,
                        testCollection;
                    before(() => {
                        previousCollection = BaseCollection._collection;
                        testCollection = {};
                        BaseCollection._collection = testCollection;
                    });
                    it('Returns the \'_collection\' attribute', () => {
                        assert.equal(BaseCollection._collection, testCollection);
                    });
                    afterEach(() => {
                        BaseCollection._collection = previousCollection;
                    });
                });
                describe('The \'_collection\' attribute wasn\'t set', () => {
                    it('Returns null', () => {
                        assert.isNull(BaseCollection.collection);
                    });
                });
            });
        });
        describe('create', () => {
            let fakeDb,
                testError,
                testResult;
            beforeEach(() => {
                testError = null;
                testResult = null;
                fakeDb = {
                    createCollection: (collectionName, callback) => {
                        callback(testError, testResult);
                    },
                    collection : sinon.fake((collectionName) => {
                        return testResult;
                    })
                }
            });
            it('Returns promise', () => {
                assert.instanceOf(FakeCollection.create(fakeDb), Promise);
            });
            describe('Collection was not created before', () => {
                describe('Promise resolves', () => {
                    beforeEach(() => {
                        testResult = {};
                        FakeCollection.runAfterCreate = sinon.fake(() => {
                            return new Promise((resolve, reject) => {
                                resolve();
                            });
                        });
                    });
                    it('Calls \'runAfterCreate\' method', (done) => {
                        FakeCollection.create(fakeDb).then(() => {
                            sinon.assert.calledOnce(FakeCollection.runAfterCreate);
                            done();
                        });
                    });
                    it('Resolves object', (done) => {
                        FakeCollection.create(fakeDb).then((result) => {
                            done(typeof result !== 'object');
                        });
                    });
                    it('Resolves correct object', (done) => {
                        FakeCollection.create(fakeDb).then((result) => {
                            done(result !== testResult);
                        });
                    });
                });
                describe('When an error occurred in the database\'s \'createCollection\' method', () => {
                    let testErrorMessage;
                    beforeEach(() => {
                        testErrorMessage = 'foo';
                        testError = new Error(testErrorMessage);
                    });
                    describe('When the collection does not exists', () => {
                        describe('Returned promise rejects', () => {
                            it('Rejects with an Error object', (done) => {
                                FakeCollection.create(fakeDb).catch((e) => {
                                    done(!(e instanceof Error));
                                });
                            });
                            it('Rejected Error object\'s message is correct', (done) => {
                                FakeCollection.create(fakeDb).catch((e) => {
                                    done(e.message !== testErrorMessage);
                                });
                            });
                        });
                    });
                    describe('When the collection already exists', () => {
                        beforeEach(() => {
                            testError.code = 48;
                            testResult = {};
                        });
                        describe('Returned promise resolves', () => {
                            it('Resolves an object', (done) => {
                                FakeCollection.create(fakeDb).then((collection) => {
                                    done(typeof collection !== 'object');
                                });
                            });
                            it('Resolved object is correct', (done) => {
                                FakeCollection.create(fakeDb).then((collection) => {
                                    done(collection !== testResult);
                                });
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls \'collection\' method of \'BaseCollection\' class', () => {
                                it('Called once', (done) => {
                                    FakeCollection.create(fakeDb).then((collection) => {
                                        sinon.assert.calledOnce(fakeDb.collection);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    FakeCollection.create(fakeDb).then((collection) => {
                                        assert.deepEqual(fakeDb.collection.getCall(0).args, [
                                            FakeCollection.collectionName
                                        ]);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
            describe('Collection is already created', () => {
                let testCollection;
                beforeEach(() => {
                    testCollection = {};
                    FakeCollection._collection = testCollection;
                });
                describe('Promise resolves', () => {
                    it('Resolves object', (done) => {
                        FakeCollection.create(fakeDb).then((result) => {
                            done(typeof result !== 'object');
                        });
                    });
                    it('Resolves collection', (done) => {
                        FakeCollection.create(fakeDb).then((result) => {
                            done(result !== testCollection);
                        });
                    });
                });
            });
        });
        describe('runAfterCreate', () => {
            describe('Returns correct value', () => {
                it('Returns promise', () => {
                    assert.instanceOf(FakeCollection.runAfterCreate(), Promise);
                });
                it('Returned promise resolves', (done) => {
                    FakeCollection.runAfterCreate().then(() => {
                        done();
                    });
                });
                it('Returned promise resolves \'undefined\' value', (done) => {
                    FakeCollection.runAfterCreate().then((result) => {
                        done(typeof result !== 'undefined');
                    });
                });
            });
        });
        describe('getDocument', () => {
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(BaseCollection.getDocument());
                });
            });
        });
        describe('createDocument', () => {
            describe('Returns correct value', () => {
                let testDocument,
                    insertId,
                    ObjectID;
                beforeEach(() => {
                    ObjectID = require('mongodb').ObjectID;
                    testDocument = {};
                    insertId = new ObjectID('000000000000');
                    BaseCollection._collection = {
                        insertOne: sinon.fake((document) => {
                            return new Promise((resolve, reject) => {
                                testDocument.insertedId = insertId;
                                resolve(testDocument);
                            });
                        })
                    };
                });
                it('Returns Promise', () => {
                    assert.instanceOf(BaseCollection.createDocument(testDocument), Promise);
                });
                describe('The document could be inserted into database', () => {
                    it('Returned promise resolves', (done) => {
                        BaseCollection.createDocument(testDocument).then(() => {
                            done();
                        });
                    });
                    it('Returned promise resolves object', (done) => {
                        BaseCollection.createDocument(testDocument).then((result) => {
                            done(typeof result !== 'object');
                        });
                    });
                    it('Returned promise resolves ObjectId instance', (done) => {
                        BaseCollection.createDocument(testDocument).then((result) => {
                            done(result.constructor.name !== 'ObjectID');
                        });
                    });
                    it('Returned promise resolves correct value', (done) => {
                        BaseCollection.createDocument(testDocument).then((result) => {
                            done(result !== insertId);
                        });
                    });
                });
                describe('The document could not be inserted into database', () => {
                    let testError,
                        testErrorMessage;
                    beforeEach(() => {
                        testErrorMessage = 'bar'
                        testError = new Error(testErrorMessage);
                        BaseCollection._collection = {
                            insertOne: sinon.fake((document) => {
                                return new Promise((resolve, reject) => {
                                    reject(testError);
                                });
                            })
                        };
                    });
                    it('Returned promise rejects', (done) => {
                        BaseCollection.createDocument(testDocument).catch(() => {
                            done();
                        });
                    });
                    it('Returned promise rejects error', (done) => {
                        BaseCollection.createDocument(testDocument).catch((error) => {
                            done(!(error instanceof Error));
                        });
                    });
                    it('Rejected error\'s message is correct', (done) => {
                        BaseCollection.createDocument(testDocument).catch((error) => {
                            done(error.message !== testErrorMessage);
                        });
                    });
                });
            });
        });
        describe('updateDocument', () => {
            let testId,
                testValues,
                fakeGetStructure,
                ObjectId;
            beforeEach(() => {
                ObjectId = require('mongodb').ObjectId;
                testId = '000000000000';
                testValues = {
                    foo: 'bar'
                };
                fakeGetStructure = sinon.fake(() => {
                    return {
                        foo: {
                            name: 'foo'
                        },
                        bar: {
                            name: 'bar'
                        }
                    };
                });
                BaseCollection.getDocument = sinon.fake(() => {
                    return {
                        getStructure: fakeGetStructure
                    }
                });
                BaseCollection._collection = {
                    updateOne: sinon.fake((filter, values) => {
                    })
                }
                BaseCollection.updateDocument(testId, testValues);
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(BaseCollection.updateDocument(testId, testValues));
                });
                it('Calls the \'getDocument\' method of the Collection', () => {
                    sinon.assert.calledOnce(BaseCollection.getDocument);
                });
                it('Calls the \'getStructure\' method of the object returned by the \'getDocument\' method', () => {
                    sinon.assert.calledOnce(fakeGetStructure);
                });
                it('Calls the \'updateOne\' method of the _collection attribute', () => {
                    sinon.assert.calledOnce(BaseCollection._collection.updateOne);
                });
                it('Calls the \'updateOne\' method with correct parameters', () => {
                    assert.deepEqual(BaseCollection._collection.updateOne.getCall(0).args, [
                        {
                            _id: new ObjectId(testId)
                        },
                        {
                            $set: {
                                foo: 'bar'
                            }
                        }
                    ]);
                });
            });
        });
        describe('deleteDocument', () => {
            let testError,
                testResult,
                testId;
            beforeEach(() => {
                testError = null;
                testResult = {
                    result: {
                        ok: 1
                    }
                };
                testId = '000000000000';
                BaseCollection._collection = {
                    deleteOne: sinon.fake((filter, callback) => {
                        callback(testError, testResult);
                    })
                };
            });
            describe('Returns correct value', () => {
                it('Returns Promise', () => {
                    assert.instanceOf(BaseCollection.deleteDocument(), Promise);
                });
                it('Calls \'deleteOne\' method of collection', () => {
                    BaseCollection.deleteDocument(testId);
                    sinon.assert.calledOnce(BaseCollection._collection.deleteOne);
                });
                describe('Promise resolves', (done) => {
                    it('Resolves boolean', (done) => {
                        BaseCollection.deleteDocument(testId).then((result) => {
                            done(typeof result !== 'boolean');
                        });
                    });
                    it('Resolves true', (done) => {
                        BaseCollection.deleteDocument(testId).then((result) => {
                            done(!result);
                        });
                    });
                });
                describe('Promise rejects', (done) => {
                    let testErrorMessage;
                    beforeEach(() => {
                        testErrorMessage = 'foo';
                        testError = new Error(testErrorMessage);
                    });
                    it('Rejects Error', (done) => {
                        BaseCollection.deleteDocument(testId).catch((error) => {
                            done(!(error instanceof Error));
                        });
                    });
                    it('Rejected Error\'s message is correct', (done) => {
                        BaseCollection.deleteDocument(testId).catch((error) => {
                            done(error.message !== testErrorMessage);
                        });
                    });
                });
            });
        });
    });
});