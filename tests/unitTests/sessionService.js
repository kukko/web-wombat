let { assert } = require('chai'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('SessionService', () => {
    let SessionService;
    before(() => {
        SessionService = require('../../src/services/SessionService/SessionService');
    });
    it('Can be loaded', () => {
        assert.isFunction(SessionService);
    });
    describe('Have basic documented methods', () => {
        it('getSessions', () => {
            assert.isFunction(SessionService.getSessions);
        });
        it('getSession', () => {
            assert.isFunction(SessionService.getSession);
        });
        it('setSessions', () => {
            assert.isFunction(SessionService.setSessions);
        });
        it('setSession', () => {
            assert.isFunction(SessionService.setSession);
        });
        it('writeToSession', () => {
            assert.isFunction(SessionService.writeToSession);
        });
        it('sessionStarted', () => {
            assert.isFunction(SessionService.sessionStarted);
        });
        it('startSession', () => {
            assert.isFunction(SessionService.startSession);
        });
        it('sessionExists', () => {
            assert.isFunction(SessionService.sessionExists);
        });
        it('createSession', () => {
            assert.isFunction(SessionService.createSession);
        });
        it('generateUUID', () => {
            assert.isFunction(SessionService.generateUUID);
        });
        it('setWithSessions', () => {
            assert.isFunction(SessionService.setWithSessions);
        });
        it('setWithoutSessions', () => {
            assert.isFunction(SessionService.setWithoutSessions);
        });
        it('isWithSessions', () => {
            assert.isFunction(SessionService.isWithSessions);
        });
        it('setPersistInterval', () => {
            assert.isFunction(SessionService.setPersistInterval);
        });
        it('getPersistInterval', () => {
            assert.isFunction(SessionService.getPersistInterval);
        });
        it('setPersister', () => {
            assert.isFunction(SessionService.setPersister);
        });
        it('getPersister', () => {
            assert.isFunction(SessionService.getPersister);
        });
    });
    describe('Methods works as expected', () => {
        let testRequest,
            testCookies,
            testSessionIdCookie,
            testSessionId,
            sessionsBefore;
        beforeEach(() => {
            testSessionId = 'foo'
            testSessionIdCookie = 'node-sessid';
            testCookies = [];
            testCookies[testSessionIdCookie] = testSessionId;
            testRequest = {
                cookies: testCookies
            };
            sessionsBefore = Object.assign({}, SessionService.sessions);
        });
        describe('getSessions', () => {
            describe('Returns correct value', () => {
                it('Returned value is an \'array\'', () => {
                    assert.isObject(SessionService.getSessions());
                });
                it('Returned value is correct', () => {
                    assert.equal(SessionService.getSessions(), SessionService.sessions);
                });
            });
        });
        describe('getSession', () => {
            describe('Session id cookie exists in request', () => {
                describe('Session exists', () => {
                    let testSession;
                    beforeEach(() => {
                        testSession = {
                            foo: 'bar'
                        };
                        SessionService.sessions[testSessionId] = testSession;
                    });
                    describe('Returns correct value', () => {
                        it('Returns object', () => {
                            assert.isObject(SessionService.getSession(testRequest));
                        });
                        it('Returned object is correct', () => {
                            assert.equal(SessionService.getSession(testRequest), testSession);
                        });
                    });
                });
                describe('Session does not exists', () => {
                    describe('Returns correct value', () => {
                        it('Returns \'undefined\' value', () => {
                            assert.isUndefined(SessionService.getSession(testRequest));
                        });
                    });
                });
            });
            describe('Session id cookie does not exists in request', () => {
                beforeEach(() => {
                    testRequest.cookies = [];
                });
                describe('Returns correct value', () => {
                    it('Returns \'undefined\'', () => {
                        assert.isUndefined(SessionService.getSession(testRequest));
                    });
                });
            });
        });
        describe('setSessions', () => {
            let testSessions;
            beforeEach(() => {
                testSessions = [
                    {
                        foo: 'bar'
                    }
                ];
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.setSessions(testSessions));
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    SessionService.setSessions(testSessions);
                });
                it('Modifies \'sessions\' properly', () => {
                    assert.equal(SessionService.sessions, testSessions);
                });
            });
        });
        describe('setSession', () => {
            let testUUID,
                testSession;
            beforeEach(() => {
                testUUID = 'foo'
                testSession = {
                    foo: 'bar'
                };
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.setSession(testUUID, testSession));
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    SessionService.setSession(testUUID, testSession);
                });
                it('Modifies \'sessions\' properly', () => {
                    assert.equal(SessionService.sessions[testUUID], testSession);
                });
            });
        });
        describe('writeToSession', () => {
            describe('Session exists', () => {
                let testSession,
                    testKey,
                    testValue;
                beforeEach(() => {
                    testSession = {};
                    SessionService.sessions[testSessionId] = testSession;
                    testKey = 'foo';
                    testValue = 'bar';
                });
                describe('Returns correct value', () => {
                    it('Returns \'undefined\' value', () => {
                        assert.isUndefined(SessionService.writeToSession(testRequest, testKey, testValue));
                    });
                });
                describe('Modifies attributes properly', () => {
                    beforeEach(() => {
                        SessionService.writeToSession(testRequest, testKey, testValue)
                    });
                    it('Modifies \'sessions\' properly', () => {
                        let expectedSession = {};
                        expectedSession[testKey] = testValue;
                        assert.deepEqual(SessionService.sessions[testSessionId], expectedSession);
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        sinon.spy(SessionService, 'sessionExists');
                        sinon.spy(SessionService, 'createSession');
                        SessionService.writeToSession(testRequest, testKey, testValue)
                    });
                    describe('Calls \'sessionExists\' method of \'SessionService\' class', () => {
                        it('Called once', () => {
                            sinon.assert.calledOnce(SessionService.sessionExists);
                        });
                        it('Called with correct parameters', () => {
                            assert.deepEqual(SessionService.sessionExists.getCall(0).args, [
                                testRequest.cookies[testSessionIdCookie]
                            ]);
                        });
                    });
                    describe('Calls \'createSession\' method of \'SessionService\' class', () => {
                        it('Not called', () => {
                            sinon.assert.notCalled(SessionService.createSession);
                        });
                    });
                    afterEach(() => {
                       sinon.restore(); 
                    });
                });
            });
            describe('Session does not exists', () => {
                let testKey,
                    testValue;
                beforeEach(() => {
                    testKey = 'foo';
                    testValue = 'bar';
                });
                describe('Returns correct value', () => {
                    it('Returns \'undefined\' value', () => {
                        assert.isUndefined(SessionService.writeToSession(testRequest, testKey, testValue));
                    });
                });
                describe('Modifies attributes properly', () => {
                    beforeEach(() => {
                        SessionService.writeToSession(testRequest, testKey, testValue)
                    });
                    it('Modifies \'sessions\' properly', () => {
                        let expectedSession = {};
                        expectedSession[testKey] = testValue;
                        assert.deepEqual(SessionService.sessions[testSessionId], expectedSession);
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        sinon.spy(SessionService, 'sessionExists');
                        sinon.spy(SessionService, 'createSession');
                        SessionService.writeToSession(testRequest, testKey, testValue)
                    });
                    describe('Calls \'sessionExists\' method of \'SessionService\' class', () => {
                        it('Called once', () => {
                            sinon.assert.calledOnce(SessionService.sessionExists);
                        });
                        it('Called with correct parameters', () => {
                            assert.deepEqual(SessionService.sessionExists.getCall(0).args, [
                                testRequest.cookies[testSessionIdCookie]
                            ]);
                        });
                    });
                    describe('Calls \'createSession\' method of \'SessionService\' class', () => {
                        it('Called once', () => {
                            sinon.assert.calledOnce(SessionService.createSession);
                        });
                        it('Called with correct parameters', () => {
                            assert.deepEqual(SessionService.createSession.getCall(0).args, [
                                testRequest.cookies[testSessionIdCookie]
                            ]);
                        });
                    });
                    afterEach(() => {
                       sinon.restore(); 
                    });
                });
            });
        });
        describe('sessionStarted', () => {
            describe('Session started', () => {
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(SessionService.sessionStarted(testRequest));
                    });
                    it('Returned boolean is \'true\'', () => {
                        assert.isTrue(SessionService.sessionStarted(testRequest));
                    });
                });
            });
            describe('Session did not started', () => {
                beforeEach(() => {
                    testRequest.cookies = [];
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(SessionService.sessionStarted(testRequest));
                    });
                    it('Returned boolean is \'true\'', () => {
                        assert.isFalse(SessionService.sessionStarted(testRequest));
                    });
                });
            });
        });
        describe('startSession', () => {
            let testResponse,
                generateUUIDBefore,
                fakeGenerateUUID,
                testUUID;
            beforeEach(() => {
                SessionService = proxyquire.load('../../src/services/SessionService/SessionService.js', {
                    '../CookieService/CookieService': {
                        setCookie: sinon.stub()
                    }
                });
                testUUID = 'foo';
                generateUUIDBefore = SessionService.generateUUID;
                fakeGenerateUUID = sinon.fake(() => {
                    return testUUID;
                });
                SessionService.generateUUID = fakeGenerateUUID;
                sinon.spy(SessionService, 'createSession');
                testResponse = {};
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.startSession(testRequest, testResponse));
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    SessionService.startSession(testRequest, testResponse);
                });
                describe('Calls \'generateUUID\' method of \'SessionService\' class', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(fakeGenerateUUID);
                    });
                    it('Called with correct parameters', () => {
                        assert.deepEqual(fakeGenerateUUID.getCall(0).args, []);
                    });
                });
                describe('Calls \'setCookie\' method of \'CookieService\' class', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(SessionService.CookieService.setCookie);
                    });
                    it('Called with correct parameters', () => {
                        assert.deepEqual(SessionService.CookieService.setCookie.getCall(0).args, [
                            testRequest,
                            testResponse,
                            testSessionIdCookie,
                            testUUID
                        ]);
                    });
                });
                describe('Calls \'createSession\' method of \'SessionService\' class', () => {
                    it('Called once', () => {
                        sinon.assert.calledOnce(SessionService.createSession);
                    });
                    it('Called with correct parameters', () => {
                        assert.deepEqual(SessionService.createSession.getCall(0).args, [
                            testUUID
                        ]);
                    });
                });
            });
            afterEach(() => {
                SessionService.generateUUID = generateUUIDBefore;
            });
        });
        describe('sessionExists', () => {
            describe('Session exists', () => {
                let testSession;
                beforeEach(() => {
                    testSession = {};
                    SessionService.sessions[testSessionId] = testSession;
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(SessionService.sessionExists(testSessionId));
                    });
                    it('Returned boolean is \'true\'', () => {
                        assert.isTrue(SessionService.sessionExists(testSessionId));
                    });
                });
            });
            describe('Session does not exists', () => {
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(SessionService.sessionExists(testSessionId));
                    });
                    it('Returned boolean is \'true\'', () => {
                        assert.isFalse(SessionService.sessionExists(testSessionId));
                    });
                });
            });
        });
        describe('createSession', () => {
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.createSession(testSessionId));
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    SessionService.createSession(testSessionId);
                });
                it('Modifies \'sessions\' properly', () => {
                    let expectedSessions = {};
                    expectedSessions[testSessionId] = {};
                    assert.deepEqual(SessionService.sessions, expectedSessions);
                });
            });
        });
        describe('generateUUID', () => {
            let lengthParameter,
                possibleCharsParameter,
                mathRandomBefore,
                fakeMathRandom,
                fakeRandomReturnValue,
                defaultLengthParameter,
                defaultPossibleCharsParameter;
            beforeEach(() => {
                mathRandomBefore = Math.random;
                fakeRandomReturnValue = 0;
                fakeMathRandom = sinon.fake(() => {
                    return fakeRandomReturnValue;
                });
                Math.random = fakeMathRandom;
                defaultLengthParameter = 8;
                defaultPossibleCharsParameter = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            });
            describe('The \'length\' parameter is \'undefined\'', () => {
                beforeEach(() => {
                    lengthParameter = undefined;
                });
                describe('The \'possibleChars\' parameter is \'undefined\'', () => {
                    beforeEach(() => {
                        possibleCharsParameter = undefined;
                    });
                    describe('Returns correct value', () => {
                        it('Returned value is string', () => {
                            assert.isString(SessionService.generateUUID(lengthParameter, possibleCharsParameter));
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.lengthOf(SessionService.generateUUID(lengthParameter, possibleCharsParameter), defaultLengthParameter);
                        });
                        it('Returned string is correct', () => {
                            assert.equal(SessionService.generateUUID(lengthParameter, possibleCharsParameter), defaultPossibleCharsParameter[fakeRandomReturnValue].repeat(defaultLengthParameter));
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls \'random\' method of \'Math\' class', () => {
                            beforeEach(() => {
                                SessionService.generateUUID(lengthParameter, possibleCharsParameter);
                            });
                            it('Called once', () => {
                                sinon.assert.callCount(Math.random, defaultLengthParameter);
                            });
                            it('Called with correct parameters', () => {
                                sinon.assert.alwaysCalledWith(Math.random);
                            });
                        });
                    });
                });
                describe('The \'possibleChars\' parameter is passed', () => {
                    beforeEach(() => {
                        possibleCharsParameter = 'foo';
                    });
                    describe('Returns correct value', () => {
                        it('Returned value is string', () => {
                            assert.isString(SessionService.generateUUID(lengthParameter, possibleCharsParameter));
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.lengthOf(SessionService.generateUUID(lengthParameter, possibleCharsParameter), defaultLengthParameter);
                        });
                        it('Returned string is correct', () => {
                            assert.equal(SessionService.generateUUID(lengthParameter, possibleCharsParameter), possibleCharsParameter[fakeRandomReturnValue].repeat(defaultLengthParameter));
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls \'random\' method of \'Math\' class', () => {
                            beforeEach(() => {
                                SessionService.generateUUID(lengthParameter, possibleCharsParameter);
                            });
                            it('Called once', () => {
                                sinon.assert.callCount(Math.random, defaultLengthParameter);
                            });
                            it('Called with correct parameters', () => {
                                sinon.assert.alwaysCalledWith(Math.random);
                            });
                        });
                    });
                });
            });
            describe('The \'length\' parameter is passed', () => {
                beforeEach(() => {
                    lengthParameter = defaultLengthParameter * 2;
                });
                describe('The \'possibleChars\' parameter is \'undefined\'', () => {
                    beforeEach(() => {
                        possibleCharsParameter = undefined;
                    });
                    describe('Returns correct value', () => {
                        it('Returned value is string', () => {
                            assert.isString(SessionService.generateUUID(lengthParameter, possibleCharsParameter));
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.lengthOf(SessionService.generateUUID(lengthParameter, possibleCharsParameter), lengthParameter);
                        });
                        it('Returned string is correct', () => {
                            assert.equal(SessionService.generateUUID(lengthParameter, possibleCharsParameter), defaultPossibleCharsParameter[fakeRandomReturnValue].repeat(lengthParameter));
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls \'random\' method of \'Math\' class', () => {
                            beforeEach(() => {
                                SessionService.generateUUID(lengthParameter, possibleCharsParameter);
                            });
                            it('Called once', () => {
                                sinon.assert.callCount(Math.random, lengthParameter);
                            });
                            it('Called with correct parameters', () => {
                                sinon.assert.alwaysCalledWith(Math.random);
                            });
                        });
                    });
                });
                describe('The \'possibleChars\' parameter is passed', () => {
                    beforeEach(() => {
                        possibleCharsParameter = 'foo';
                    });
                    describe('Returns correct value', () => {
                        it('Returned value is string', () => {
                            assert.isString(SessionService.generateUUID(lengthParameter, possibleCharsParameter));
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.lengthOf(SessionService.generateUUID(lengthParameter, possibleCharsParameter), lengthParameter);
                        });
                        it('Returned string is correct', () => {
                            assert.equal(SessionService.generateUUID(lengthParameter, possibleCharsParameter), possibleCharsParameter[fakeRandomReturnValue].repeat(lengthParameter));
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls \'random\' method of \'Math\' class', () => {
                            beforeEach(() => {
                                SessionService.generateUUID(lengthParameter, possibleCharsParameter);
                            });
                            it('Called once', () => {
                                sinon.assert.callCount(Math.random, lengthParameter);
                            });
                            it('Called with correct parameters', () => {
                                sinon.assert.alwaysCalledWith(Math.random);
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                Math.random = mathRandomBefore;
            });
        });
        describe('setWithSessions', () => {
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.setWithSessions());
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    SessionService.startSessions = false;
                    SessionService.setWithSessions();
                });
                it('Modifies \'sessions\' properly', () => {
                    assert.isTrue(SessionService.startSessions);
                });
            });
        });
        describe('setWithoutSessions', () => {
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.setWithoutSessions());
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    SessionService.startSessions = true;
                    SessionService.setWithoutSessions();
                });
                it('Modifies \'sessions\' properly', () => {
                    assert.isFalse(SessionService.startSessions);
                });
            });
        });
        describe('isWithSessions', () => {
            describe('The \'startSession\' attribute of \'SessionService\' class is true', () => {
                beforeEach(() => {
                    SessionService.startSessions = true;
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(SessionService.isWithSessions());
                    });
                    it('Returned value is correct', () => {
                        assert.isTrue(SessionService.isWithSessions());
                    });
                });
            });
            describe('The \'startSession\' attribute of \'SessionService\' class is false', () => {
                beforeEach(() => {
                    SessionService.startSessions = false;
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(SessionService.isWithSessions());
                    });
                    it('Returned value is correct', () => {
                        assert.isFalse(SessionService.isWithSessions());
                    });
                });
            });
        });
        describe('setPersistInterval', () => {
            let testPersisInterval;
            beforeEach(() => {
                testPersisInterval = 10000;
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.setPersistInterval(testPersisInterval));
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    SessionService.persistInterval = testPersisInterval * 2;
                    SessionService.setPersistInterval(testPersisInterval);
                });
                it('Modifies \'persistInterval\' properly', () => {
                    assert.equal(SessionService.persistInterval, testPersisInterval);
                });
            });
        });
        describe('getPersistInterval', () => {
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isNumber(SessionService.getPersistInterval());
                });
                it('Returned value is correct', () => {
                    assert.equal(SessionService.getPersistInterval(), SessionService.persistInterval);
                });
            });
        });
        describe('setPersister', () => {
            let testPersister;
            beforeEach(() => {
                testPersister = {};
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\' value', () => {
                    assert.isUndefined(SessionService.setPersister(testPersister));
                });
            });
            describe('Modifies attributes properly', () => {
                beforeEach(() => {
                    SessionService.persister = null;
                    SessionService.setPersister(testPersister);
                });
                it('Modifies \'persister\' properly', () => {
                    assert.equal(SessionService.persister, testPersister);
                });
            });
        });
        describe('getPersister', () => {
            let testPersister;
            beforeEach(() => {
                testPersister = {};
                SessionService.persister = testPersister;
            });
            describe('Returns correct value', () => {
                it('Returns an object', () => {
                    assert.isObject(SessionService.getPersister());
                });
                it('Returned value is correct', () => {
                    assert.equal(SessionService.getPersister(), testPersister);
                });
            });
        });
        afterEach(() => {
            SessionService.sessions = Object.assign({}, sessionsBefore);
        });
    });
});