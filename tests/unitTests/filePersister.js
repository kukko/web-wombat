let { assert } = require('chai'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('FilePersister', () => {
    let FilePersister;
    before(() => {
        FilePersister = require('../../src/services/SessionService/SessionPersisters/FilePersister/FilePersister');
    });
    it('Can be loaded', () => {
        assert.isFunction(FilePersister);
    });
    describe('Have basic documented methods', () => {
        it('persistSessions', () => {
            assert.isFunction(FilePersister.persistSessions);
        });
        it('loadSessions', () => {
            assert.isFunction(FilePersister.loadSessions);
        });
        it('setPersistedFilePath', () => {
            assert.isFunction(FilePersister.setPersistedFilePath);
        });
        it('getPersistedFilePath', () => {
            assert.isFunction(FilePersister.getPersistedFilePath);
        });
    });
    describe('Methods works as expected', () => {
        describe('persistSessions', () => {
            let testSessions,
                fakeWriteFileSync;
            beforeEach(() => {
                fakeWriteFileSync = sinon.fake();
                FilePersister = proxyquire.load('../../src/services/SessionService/SessionPersisters/FilePersister/FilePersister', {
                    'fs': {
                        writeFileSync: fakeWriteFileSync
                    }
                });
                testSessions = [];
            });
            describe('Returns correct value', () => {
                it('Returns \'Promise\'', () => {
                    assert.instanceOf(FilePersister.persistSessions(testSessions), Promise);
                });
                it('Returned \'Promise\' resolves', (done) => {
                    FilePersister.persistSessions(testSessions).then(() => {
                        done();
                    });
                });
                it('Returned \'Promise\' resolves \'true\' value', (done) => {
                    FilePersister.persistSessions(testSessions).then((result) => {
                        done(result !== true);
                    });
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    sinon.spy(FilePersister, 'getPersistedFilePath');
                    sinon.spy(JSON, 'stringify');
                });
                describe('Calls \'getPersistedFilePath\' method of \'FilePersister\' class', () => {
                    it('Called once', (done) => {
                        FilePersister.persistSessions(testSessions).then(() => {
                            sinon.assert.calledOnce(FilePersister.getPersistedFilePath);
                            done();
                        });
                    });
                    it('Called with correct parameters', (done) => {
                        FilePersister.persistSessions(testSessions).then(() => {
                            assert.deepEqual(FilePersister.getPersistedFilePath.getCall(0).args, []);
                            done();
                        });
                    });
                });
                describe('Calls \'stringify\' method of \'JSON\' class', () => {
                    it('Called once', (done) => {
                        FilePersister.persistSessions(testSessions).then(() => {
                            sinon.assert.calledOnce(JSON.stringify);
                            done();
                        });
                    });
                    it('Called with correct parameters', (done) => {
                        FilePersister.persistSessions(testSessions).then(() => {
                            assert.deepEqual(JSON.stringify.getCall(0).args, [
                                testSessions
                            ]);
                            done();
                        });
                    });
                });
                describe('Calls \'writeFileSync\' method of \'fs\' module', () => {
                    it('Called once', (done) => {
                        FilePersister.persistSessions(testSessions).then(() => {
                            sinon.assert.calledOnce(fakeWriteFileSync);
                            done();
                        });
                    });
                    it('Called with correct parameters', (done) => {
                        FilePersister.persistSessions(testSessions).then(() => {
                            assert.deepEqual(fakeWriteFileSync.getCall(0).args, [
                                './persistedSessions.json',
                                '[]'
                            ]);
                            done();
                        });
                    });
                });
                afterEach(() => {
                    sinon.restore();
                });
            });
        });



        describe('loadSessions', () => {
            let existSyncReturnValue,
                testPersistedSessionsString;
            beforeEach(() => {
                testPersistedSessionsString = '[]';
                fakeExistsSync = sinon.fake(() => {
                    return existSyncReturnValue;
                });
                fakeReadFileSync = sinon.fake(() => {
                    return testPersistedSessionsString;
                });
                FilePersister = proxyquire.load('../../src/services/SessionService/SessionPersisters/FilePersister/FilePersister', {
                    'fs': {
                        existsSync: fakeExistsSync,
                        readFileSync: fakeReadFileSync
                    }
                });
                sinon.spy(JSON, 'parse');
                testSessions = [];
            });
            describe('The \'existsSync\' method of \'fs\' module returns \'true\' value', () => {
                beforeEach(() => {
                    existSyncReturnValue = true;
                });
                describe('Returns correct value', () => {
                    it('Returns \'Promise\'', () => {
                        assert.instanceOf(FilePersister.loadSessions(), Promise);
                    });
                    it('Returned \'Promise\' resolves', (done) => {
                        FilePersister.loadSessions().then(() => {
                            done();
                        });
                    });
                    it('Returned \'Promise\' resolves \'array\' value', (done) => {
                        FilePersister.loadSessions().then((result) => {
                            done(!(result instanceof Array));
                        });
                    });
                });
                describe('Calls methods', () => {
                    describe('Calls \'existsSync\' method of \'fs\' module', () => {
                        it('Called once', (done) => {
                            FilePersister.loadSessions().then(() => {
                                sinon.assert.calledOnce(fakeExistsSync);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            FilePersister.loadSessions().then(() => {
                                assert.deepEqual(fakeExistsSync.getCall(0).args, [
                                    './persistedSessions.json'
                                ]);
                                done();
                            });
                        });
                    });
                    describe('Calls \'readFileSync\' method of \'fs\' module', () => {
                        it('Called once', (done) => {
                            FilePersister.loadSessions().then(() => {
                                sinon.assert.calledOnce(fakeReadFileSync);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            FilePersister.loadSessions().then(() => {
                                assert.deepEqual(fakeReadFileSync.getCall(0).args, [
                                    './persistedSessions.json',
                                    {
                                        encoding: 'UTF-8'
                                    }
                                ]);
                                done();
                            });
                        });
                    });
                    describe('Calls \'parse\' method of \'JSON\' module', () => {
                        it('Called once', (done) => {
                            FilePersister.loadSessions().then(() => {
                                sinon.assert.calledOnce(JSON.parse);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            FilePersister.loadSessions().then(() => {
                                assert.deepEqual(JSON.parse.getCall(0).args, [
                                    testPersistedSessionsString
                                ]);
                                done();
                            });
                        });
                    });
                });
            });
            describe('The \'existsSync\' method of \'fs\' module returns \'false\' value', () => {
                beforeEach(() => {
                    existSyncReturnValue = false;
                });
                describe('Returns correct value', () => {
                    it('Returns \'Promise\'', () => {
                        assert.instanceOf(FilePersister.loadSessions(), Promise);
                    });
                    it('Returned \'Promise\' resolves', (done) => {
                        FilePersister.loadSessions().then(() => {
                            done();
                        });
                    });
                    it('Returned \'Promise\' resolves \'null\' value', (done) => {
                        FilePersister.loadSessions().then((result) => {
                            done(result !== null);
                        });
                    });
                });
                describe('Calls methods', () => {
                    describe('Calls \'existsSync\' method of \'fs\' module', () => {
                        it('Called once', (done) => {
                            FilePersister.loadSessions().then(() => {
                                sinon.assert.calledOnce(fakeExistsSync);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            FilePersister.loadSessions().then(() => {
                                assert.deepEqual(fakeExistsSync.getCall(0).args, [
                                    './persistedSessions.json'
                                ]);
                                done();
                            });
                        });
                    });
                    describe('Calls \'readFileSync\' method of \'fs\' module', () => {
                        it('Not called', (done) => {
                            FilePersister.loadSessions().then(() => {
                                sinon.assert.notCalled(fakeReadFileSync);
                                done();
                            });
                        });
                    });
                    describe('Calls \'parse\' method of \'JSON\' class', () => {
                        it('Not called', (done) => {
                            FilePersister.loadSessions().then(() => {
                                sinon.assert.notCalled(JSON.parse);
                                done();
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });



        describe('setPersistedFilePath', () => {
            let testPersistedFilePath,
                originalPersistedFilePath;
            beforeEach(() => {
                originalPersistedFilePath = FilePersister.persistedFilePath;
                testPersistedFilePath = './foo.json';
            });
            describe('Returns correct value', () => {
                it('Returned value is \'undefined\'', () => {
                    assert.isUndefined(FilePersister.setPersistedFilePath(testPersistedFilePath));
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    FilePersister.setPersistedFilePath(testPersistedFilePath);
                });
                it('Modifies \'persistedFilePath\' properly', () => {
                    assert.equal(FilePersister.persistedFilePath, testPersistedFilePath);
                });
            });
            afterEach(() => {
                FilePersister.persistedFilePath = originalPersistedFilePath;
            });
        });
        describe('getPersistedFilePath', () => {
            describe('Returns correct value', () => {
                it('Returned value is string', () => {
                    assert.isString(FilePersister.getPersistedFilePath());
                });
                it('Returned value is correct', () => {
                    assert.equal(FilePersister.getPersistedFilePath(), './persistedSessions.json');
                });
                it('Returned value is equal with the \'persistedFilePath\' attribute of FilePersister', () => {
                    assert.equal(FilePersister.getPersistedFilePath(), FilePersister.persistedFilePath);
                });
            });
        });
    });
});