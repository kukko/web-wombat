let { assert } = require('chai'),
    sinon = require('sinon');

describe('AbstractSessionPersister', () => {
    let AbstractSessionPersister;
    before(() => {
        AbstractSessionPersister = require('../../index.js').AbstractSessionPersister;
    });
    it('Can be loaded', () => {
        assert.isFunction(AbstractSessionPersister);
    });
    describe('Have basic documented methods', () => {
        it('persistSessions', () => {
            assert.isFunction(AbstractSessionPersister.persistSessions);
        });
        it('loadSessions', () => {
            assert.isFunction(AbstractSessionPersister.loadSessions);
        });
        it('persist', () => {
            assert.isFunction(AbstractSessionPersister.persist);
        });
        it('load', () => {
            assert.isFunction(AbstractSessionPersister.load);
        });
        it('getState', () => {
            assert.isFunction(AbstractSessionPersister.getState);
        });
        it('getIdleState', () => {
            assert.isFunction(AbstractSessionPersister.getIdleState);
        });
        it('getWorkingState', () => {
            assert.isFunction(AbstractSessionPersister.getWorkingState);
        });
        it('switchToIdleState', () => {
            assert.isFunction(AbstractSessionPersister.switchToIdleState);
        });
        it('switchToWorkingState', () => {
            assert.isFunction(AbstractSessionPersister.switchToWorkingState);
        });
        it('canStartPeristing', () => {
            assert.isFunction(AbstractSessionPersister.canStartPeristing);
        });
        it('canLoadPersistedData', () => {
            assert.isFunction(AbstractSessionPersister.canLoadPersistedData);
        });
    });
    describe('Methods works as expected', () => {
        let testSessions;
        beforeEach(() => {
            testSessions = [];
        });
        describe('persistSessions', () => {
            it('Throws expection', () => {
                assert.throw(AbstractSessionPersister.persistSessions);
            });
        });
        describe('loadSessions', () => {
            it('Throws expection', () => {
                assert.throw(AbstractSessionPersister.loadSessions);
            });
        });
        describe('persist', () => {
            describe('The \'canStartPeristing\' method returns true', () => {
                let originalCanStartPeristing;
                beforeEach(() => {
                    originalCanStartPeristing = AbstractSessionPersister.canStartPeristing;
                    AbstractSessionPersister.canStartPeristing = sinon.fake(() => {
                        return true;
                    });
                });
                describe('The promise returned by the \'persistSessions\' method resolves', () => {
                    let originalPersistSessions;
                    beforeEach(() => {
                        originalPersistSessions = AbstractSessionPersister.persistSessions;
                        AbstractSessionPersister.persistSessions = sinon.fake(() => {
                            return new Promise((resolve, reject) => {
                                resolve();
                            });
                        });
                        AbstractSessionPersister.switchToIdleState();
                        sinon.spy(console, 'error');
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'undefined\'', () => {
                            assert.isUndefined(AbstractSessionPersister.persist(testSessions));
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            sinon.spy(AbstractSessionPersister, 'switchToWorkingState');
                            sinon.spy(AbstractSessionPersister, 'switchToIdleState');
                            AbstractSessionPersister.persist(testSessions);
                        });
                        describe('Calls \'canStartPeristing\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.canStartPeristing);
                            });
                            it('Called without parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.canStartPeristing.getCall(0).args, []);
                            });
                        });
                        describe('Calls \'switchToWorkingState\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.switchToWorkingState);
                            });
                            it('Called without parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.switchToWorkingState.getCall(0).args, []);
                            });
                        });
                        describe('Calls \'persistSessions\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.persistSessions);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.persistSessions.getCall(0).args, [
                                    testSessions
                                ]);
                            });
                        });
                        describe('Calls \'switchToIdleState\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.switchToIdleState);
                            });
                            it('Called without parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.switchToIdleState.getCall(0).args, []);
                            });
                        });
                        describe('Not calls \'error\' method of \'console\'', () => {
                            it('Not called', () => {
                                sinon.assert.notCalled(console.error);
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    afterEach(() => {
                        AbstractSessionPersister.persistSessions = originalPersistSessions;
                        sinon.restore();
                    });
                });
                describe('The promise returned by the \'persistSessions\' method rejects', () => {
                    let testError,
                        originalConsoleError,
                        originalPersistSessions;
                    beforeEach(() => {
                        testError = {
                            message: 'foo'
                        };
                        originalPersistSessions = AbstractSessionPersister.persistSessions;
                        AbstractSessionPersister.persistSessions = sinon.fake(() => {
                            return new Promise((resolve, reject) => {
                                reject(testError);
                            });
                        });
                        AbstractSessionPersister.switchToIdleState();
                        originalConsoleError = console.error;
                        console.error = sinon.fake(() => {
                        });
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'undefined\'', () => {
                            assert.isUndefined(AbstractSessionPersister.persist(testSessions));
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            sinon.spy(AbstractSessionPersister, 'switchToWorkingState');
                            sinon.spy(AbstractSessionPersister, 'switchToIdleState');
                            AbstractSessionPersister.persist(testSessions);
                        });
                        describe('Calls \'canStartPeristing\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.canStartPeristing);
                            });
                            it('Called without parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.canStartPeristing.getCall(0).args, []);
                            });
                        });
                        describe('Calls \'switchToWorkingState\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.switchToWorkingState);
                            });
                            it('Called without parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.switchToWorkingState.getCall(0).args, []);
                            });
                        });
                        describe('Calls \'persistSessions\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.persistSessions);
                            });
                            it('Called with correct parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.persistSessions.getCall(0).args, [
                                    testSessions
                                ]);
                            });
                        });
                        describe('Calls \'switchToIdleState\' method', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(AbstractSessionPersister.switchToIdleState);
                            });
                            it('Called without parameters', () => {
                                assert.deepEqual(AbstractSessionPersister.switchToIdleState.getCall(0).args, []);
                            });
                        });
                        describe('Calls \'error\' method of \'console\'', () => {
                            it('Called once', () => {
                                sinon.assert.calledOnce(console.error);
                            });
                            it('Called without parameters', () => {
                                assert.deepEqual(console.error.getCall(0).args, [
                                    testError
                                ]);
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    afterEach(() => {
                        AbstractSessionPersister.persistSessions = originalPersistSessions;
                        console.error = originalConsoleError;
                    });
                });
                afterEach(() => {
                    AbstractSessionPersister.canStartPeristing = originalCanStartPeristing;
                });
            });
            describe('The \'canStartPeristing\' method returns false', () => {
                let originalCanStartPeristing,
                    originalConsoleError;
                beforeEach(() => {
                    originalCanStartPeristing = AbstractSessionPersister.canStartPeristing;
                    AbstractSessionPersister.canStartPeristing = sinon.fake(() => {
                        return false;
                    });
                    originalConsoleError = console.error;
                    console.error = sinon.fake();
                });
                describe('Returns correct value', () => {
                    it('Returned value is undefined', () => {
                        assert.isUndefined(AbstractSessionPersister.persist());
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        sinon.spy(AbstractSessionPersister, 'switchToWorkingState');
                        sinon.spy(AbstractSessionPersister, 'persistSessions');
                        sinon.spy(AbstractSessionPersister, 'switchToIdleState');
                        AbstractSessionPersister.persist();
                    });
                    describe('Calls \'canStartPeristing\' method', () => {
                        it('Called once', () => {
                            sinon.assert.calledOnce(AbstractSessionPersister.canStartPeristing);
                        });
                        it('Called without parameters', () => {
                            assert.deepEqual(AbstractSessionPersister.canStartPeristing.getCall(0).args, []);
                        });
                    });
                    describe('Calls \'switchToWorkingState\' method', () => {
                        it('Not called', () => {
                            sinon.assert.notCalled(AbstractSessionPersister.switchToWorkingState);
                        });
                    });
                    describe('Calls \'persistSessions\' method', () => {
                        it('Not called', () => {
                            sinon.assert.notCalled(AbstractSessionPersister.persistSessions);
                        });
                    });
                    describe('Calls \'switchToIdleState\' method', () => {
                        it('Not called', () => {
                            sinon.assert.notCalled(AbstractSessionPersister.switchToIdleState);
                        });
                    });
                    describe('Calls \'error\' method of \'console\'', () => {
                        it('Not called', () => {
                            sinon.assert.notCalled(console.error);
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                afterEach(() => {
                    AbstractSessionPersister.canStartPeristing = originalCanStartPeristing;
                    console.error = originalConsoleError;
                });
            });
        });
        describe('load', () => {
            describe('The \'canLoadPersistedData\' method returns true', () => {
                let originalLoadSessions,
                    originalCanLoadPersistedData;
                beforeEach(() => {
                    originalLoadSessions = AbstractSessionPersister.loadSessions;
                    originalCanLoadPersistedData = AbstractSessionPersister.canLoadPersistedData;
                    AbstractSessionPersister.canLoadPersistedData = sinon.fake(() => {
                        return true;
                    });
                });
                describe('The promise returned by the \'loadSessions\' method resolves', () => {
                    beforeEach(() => {
                        AbstractSessionPersister.loadSessions = sinon.fake(() => {
                            return new Promise((resolve, reject) => {
                                resolve(testSessions);
                            });
                        });
                        sinon.spy(console, 'error');
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'Promise\'', () => {
                            assert.instanceOf(AbstractSessionPersister.load(), Promise);
                        });
                        describe('Returned promise resolves correct value', () => {
                            it('Resolved value is array', (done) => {
                                AbstractSessionPersister.load().then((result) => {
                                    assert.isArray(result);
                                    done();
                                })
                            });
                            it('Resolved array is empty', (done) => {
                                AbstractSessionPersister.load().then((result) => {
                                    assert.isEmpty(result);
                                    done();
                                })
                            });
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            sinon.spy(AbstractSessionPersister, 'switchToWorkingState');
                            sinon.spy(AbstractSessionPersister, 'switchToIdleState');
                        });
                        describe('Calls \'canLoadPersistedData\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.canLoadPersistedData);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    assert.deepEqual(AbstractSessionPersister.canLoadPersistedData.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'switchToWorkingState\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.switchToWorkingState);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    assert.deepEqual(AbstractSessionPersister.switchToWorkingState.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'loadSessions\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.loadSessions);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    assert.deepEqual(AbstractSessionPersister.loadSessions.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'switchToIdleState\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.switchToIdleState);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    assert.deepEqual(AbstractSessionPersister.switchToIdleState.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Not calls \'error\' method of \'console\'', () => {
                            it('Not called', (done) => {
                                AbstractSessionPersister.load().then(() => {
                                    sinon.assert.notCalled(console.error);
                                    done();
                                });
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('The promise returned by the \'loadSessions\' method rejects', () => {
                    let testError,
                        originalConsoleError;
                    beforeEach(() => {
                        testError = {
                            foo: 'bar'
                        };
                        AbstractSessionPersister.loadSessions = sinon.fake(() => {
                            return new Promise((resolve, reject) => {
                                reject(testError);
                            });
                        });
                        originalConsoleError = console.error;
                        console.error = sinon.fake();
                    });
                    describe('Returns correct value', () => {
                        it('Returns \'Promise\'', () => {
                            assert.instanceOf(AbstractSessionPersister.load(), Promise);
                        });
                        describe('Returned promise rejects', () => {
                            it('Rejected value is correct', (done) => {
                                AbstractSessionPersister.load().catch((error) => {
                                    assert.deepEqual(error, testError);
                                    done();
                                });
                            });
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            sinon.spy(AbstractSessionPersister, 'switchToWorkingState');
                            sinon.spy(AbstractSessionPersister, 'switchToIdleState');
                        });
                        describe('Calls \'canLoadPersistedData\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.canLoadPersistedData);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    assert.deepEqual(AbstractSessionPersister.canLoadPersistedData.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'switchToWorkingState\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.switchToWorkingState);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    assert.deepEqual(AbstractSessionPersister.switchToWorkingState.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'loadSessions\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.loadSessions);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    assert.deepEqual(AbstractSessionPersister.loadSessions.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'switchToIdleState\' method', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    sinon.assert.calledOnce(AbstractSessionPersister.switchToIdleState);
                                    done();
                                });
                            });
                            it('Called without parameters', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    assert.deepEqual(AbstractSessionPersister.switchToIdleState.getCall(0).args, []);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'error\' method of \'console\'', () => {
                            it('Called once', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    sinon.assert.calledOnce(console.error);
                                    done();
                                });
                            });
                            it('Called with correct parameters', (done) => {
                                AbstractSessionPersister.load().catch(() => {
                                    assert.deepEqual(console.error.getCall(0).args, [
                                        testError
                                    ]);
                                    done();
                                });
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    afterEach(() => {
                        console.error = originalConsoleError;
                        sinon.restore();
                    });
                });
                afterEach(() => {
                    AbstractSessionPersister.loadSessions = originalLoadSessions;
                    AbstractSessionPersister.canLoadPersistedData = originalCanLoadPersistedData;
                });
            });
            describe('The \'canLoadPersistedData\' method returns false', () => {
                let originalCanLoadPersistedData;
                beforeEach(() => {
                    originalCanLoadPersistedData = AbstractSessionPersister.canLoadPersistedData;
                    AbstractSessionPersister.canLoadPersistedData = sinon.fake(() => {
                        return false;
                    });
                });
                describe('Returns correct value', () => {
                    it('Returned value is instance of Promise', () => {
                        let returnedValue = AbstractSessionPersister.load();
                        returnedValue.catch(() => {});
                        assert.instanceOf(returnedValue, Promise);
                    });
                    describe('Returned promise rejects', () => {
                        it('Rejected value is instance of Error', (done) => {
                            AbstractSessionPersister.load().catch((error) => {
                                assert.instanceOf(error, Error);
                                done();
                            });
                        });
                        it('Rejected Error\'s message is correct', (done) => {
                            AbstractSessionPersister.load().catch((error) => {
                                assert.equal(error.message, "Persister works, can not load sessions");
                                done();
                            });
                        });
                    });
                });
                describe('Calls methods', () => {
                    let originalConsoleError;
                    beforeEach(() => {
                        sinon.spy(AbstractSessionPersister, 'switchToWorkingState');
                        sinon.spy(AbstractSessionPersister, 'loadSessions');
                        sinon.spy(AbstractSessionPersister, 'switchToIdleState');
                        originalConsoleError = console.error;
                        console.error = sinon.fake(() => {
                        });
                    });
                    describe('Calls \'canLoadPersistedData\' method', () => {
                        it('Called once', (done) => {
                            AbstractSessionPersister.load().catch(() => {
                                sinon.assert.calledOnce(AbstractSessionPersister.canLoadPersistedData);
                                done();
                            });
                        });
                        it('Called without parameters', (done) => {
                            AbstractSessionPersister.load().catch(() => {
                                assert.deepEqual(AbstractSessionPersister.canLoadPersistedData.getCall(0).args, []);
                                done();
                            });
                        });
                    });
                    describe('Calls \'switchToWorkingState\' method', () => {
                        it('Not called', (done) => {
                            AbstractSessionPersister.load().catch(() => {
                                sinon.assert.notCalled(AbstractSessionPersister.switchToWorkingState);
                                done();
                            });
                        });
                    });
                    describe('Calls \'loadSessions\' method', () => {
                        it('Not called', (done) => {
                            AbstractSessionPersister.load().catch(() => {
                                sinon.assert.notCalled(AbstractSessionPersister.loadSessions);
                                done();
                            });
                        });
                    });
                    describe('Calls \'switchToIdleState\' method', () => {
                        it('Not called', (done) => {
                            AbstractSessionPersister.load().catch(() => {
                                sinon.assert.notCalled(AbstractSessionPersister.switchToIdleState);
                                done();
                            });
                        });
                    });
                    describe('Calls \'error\' method of \'console\'', () => {
                        it('Not called', (done) => {
                            AbstractSessionPersister.load().catch(() => {
                                sinon.assert.notCalled(console.error);
                                done();
                            });
                        });
                    });
                    afterEach(() => {
                        console.error = originalConsoleError;
                        sinon.restore();
                    });
                });
                afterEach(() => {
                    AbstractSessionPersister.canLoadPersistedData = originalCanLoadPersistedData;
                });
            });
        });
        describe('getState', () => {
            describe('Returns correct value', () => {
                it('Returns string', () => {
                    assert.isString(AbstractSessionPersister.getState());
                });
                it('Returned string equals with idle state', () => {
                    assert.equal(AbstractSessionPersister.getState(), AbstractSessionPersister.getIdleState());
                });
            });
        });
        describe('getIdleState', () => {
            describe('Returns correct value', () => {
                it('Returns string', () => {
                    assert.isString(AbstractSessionPersister.getIdleState());
                });
                it('Returned string equals with \'IDLE\'', () => {
                    assert.equal(AbstractSessionPersister.getIdleState(), 'IDLE');
                });
            });
        });
        describe('getWorkingState', () => {
            describe('Returns correct value', () => {
                it('Returns string', () => {
                    assert.isString(AbstractSessionPersister.getWorkingState());
                });
                it('Returned string equals with \'WORKING\'', () => {
                    assert.equal(AbstractSessionPersister.getWorkingState(), 'WORKING');
                });
            });
        });
        describe('switchToIdleState', () => {
            beforeEach(() => {
                AbstractSessionPersister.state = '';
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\'', () => {
                    assert.isUndefined(AbstractSessionPersister.switchToIdleState());
                });
            });
            describe('Modify attributes correctly', () => {
                beforeEach(() => {
                    AbstractSessionPersister.switchToIdleState();
                });
                it('Modifies the \'state\' attribute to \'IDLE\'', () => {
                    assert.equal(AbstractSessionPersister.state, 'IDLE');
                });
            });
        });
        describe('switchToWorkingState', () => {
            beforeEach(() => {
                AbstractSessionPersister.state = '';
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\'', () => {
                    assert.isUndefined(AbstractSessionPersister.switchToWorkingState());
                });
            });
            describe('Modify attributes correctly', () => {
                beforeEach(() => {
                    AbstractSessionPersister.switchToWorkingState();
                });
                it('Modifies the \'state\' attribute to \'WORKING\'', () => {
                    assert.equal(AbstractSessionPersister.state, 'WORKING');
                });
            });
        });
        describe('canStartPeristing', () => {
            describe('The state attribute equals with \'IDLE\'', () => {
                beforeEach(() => {
                    AbstractSessionPersister.state = 'IDLE';
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(AbstractSessionPersister.canStartPeristing());
                    });
                    it('Returned boolean is true', () => {
                        assert.isTrue(AbstractSessionPersister.canStartPeristing());
                    });
                });
            });
            describe('The state attribute is not equals with \'IDLE\'', () => {
                beforeEach(() => {
                    AbstractSessionPersister.state = 'foo';
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(AbstractSessionPersister.canStartPeristing());
                    });
                    it('Returned boolean is false', () => {
                        assert.isFalse(AbstractSessionPersister.canStartPeristing());
                    });
                });
            });
        });
        describe('canLoadPersistedData', () => {
            describe('The state attribute equals with \'IDLE\'', () => {
                beforeEach(() => {
                    AbstractSessionPersister.state = 'IDLE';
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(AbstractSessionPersister.canLoadPersistedData());
                    });
                    it('Returned boolean is true', () => {
                        assert.isTrue(AbstractSessionPersister.canLoadPersistedData());
                    });
                });
            });
            describe('The state attribute is not equals with \'IDLE\'', () => {
                beforeEach(() => {
                    AbstractSessionPersister.state = 'foo';
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(AbstractSessionPersister.canLoadPersistedData());
                    });
                    it('Returned boolean is false', () => {
                        assert.isFalse(AbstractSessionPersister.canLoadPersistedData());
                    });
                });
            });
        });
    });
});