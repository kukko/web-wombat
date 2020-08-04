let assert = require('chai').assert,
    sinon = require('sinon');

describe('WebSocketClientService', () => {
    let WebSocketClientService;
	before(() => {
		WebSocketClientService = require('../../src/WebSocketClientService');
    });
    it('Can be loaded', () => {
        assert.isFunction(WebSocketClientService);
    });
    describe('Have basic documented static methods', () => {
        it('addClient', () => {
            assert.isFunction(WebSocketClientService.addClient);
        });
        it('removeClient', () => {
            assert.isFunction(WebSocketClientService.removeClient);
        });
        it('getClientByUUID', () => {
            assert.isFunction(WebSocketClientService.getClientByUUID);
        });
        it('getClients', () => {
            assert.isFunction(WebSocketClientService.getClients);
        });
        it('generateUUID', () => {
            assert.isFunction(WebSocketClientService.generateUUID);
        });
    });
    describe('Methods works as expected', () => {
        let fakeWebSocketClientServiceClass,
            testSocket,
            testWebSocketTag,
            testUUID,
            clientsBeforeAll;
        beforeEach(() => {
            class FakeWebSocketClientService extends WebSocketClientService{
            }
            fakeWebSocketClientServiceClass = FakeWebSocketClientService;
            fakeWebSocketClientServiceClass.clients = [];
            testSocket = {};
            testWebSocketTag = 'foo';
            testUUID = 'bar';
        });
        describe('addClient', () => {
            beforeEach(() => {
                fakeWebSocketClientServiceClass.generateUUID = sinon.fake((webSocketTag) => {
                    return testUUID;
                });
            });
            describe('The webSocketTag is not presented in the clients attribute', () => {
                describe('Returns correct value', () => {
                    it('Returns string', () => {
                        assert.isString(fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag));
                    });
                    it('Returned string is correct', () => {
                        assert.equal(fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag), testUUID);
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                    });
                    it('Calls the \'generateUUID\' meth of the class once', () => {
                        sinon.assert.calledOnce(fakeWebSocketClientServiceClass.generateUUID);
                    });
                });
                describe('Modify attributes properly', () => {
                    beforeEach(() => {
                        fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                    });
                    it('clients', () => {
                        let testClients = [];
                        testClients[testWebSocketTag] = [];
                        testClients[testWebSocketTag][testUUID] = {};
                        assert.deepEqual(fakeWebSocketClientServiceClass.clients, testClients);
                    });
                });
            });
            describe('The webSocketTag already presented in the clients attribute', () => {
                beforeEach(() => {
                    fakeWebSocketClientServiceClass.clients[testWebSocketTag] = [];
                });
                describe('Returns correct value', () => {
                    it('Returns string', () => {
                        assert.isString(fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag));
                    });
                    it('Returned string is correct', () => {
                        assert.equal(fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag), testUUID);
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                    });
                    it('Calls the \'generateUUID\' meth of the class once', () => {
                        sinon.assert.calledOnce(fakeWebSocketClientServiceClass.generateUUID);
                    });
                });
                describe('Modify attributes properly', () => {
                    beforeEach(() => {
                        fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                    });
                    it('clients', () => {
                        let testClients = [];
                        testClients[testWebSocketTag] = [];
                        testClients[testWebSocketTag][testUUID] = {};
                        assert.deepEqual(fakeWebSocketClientServiceClass.clients, testClients);
                    });
                });
            });
            describe('Returns correct value', () => {
                it('Returns string', () => {
                    assert.isString(fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag));
                });
                it('Returned string is correct', () => {
                    assert.equal(fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag), testUUID);
                });
            });
            describe('Calls methods', () => {
                beforeEach(() => {
                    fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                });
                it('Calls the \'generateUUID\' meth of the class once', () => {
                    sinon.assert.calledOnce(fakeWebSocketClientServiceClass.generateUUID);
                });
            });
        });
        describe('removeClient', () => {
            describe('The websocket tag is presented in the clients attribute', () => {
                describe('The UUID is presented in the clients of websocketTag', () => {
                    describe('Returns correct value', () => {
                        it('Returns boolean', () => {
                            assert.isBoolean(fakeWebSocketClientServiceClass.removeClient(testUUID, testWebSocketTag));
                        });
                        it('Returned boolean\'s value is false', () => {
                            assert.isFalse(fakeWebSocketClientServiceClass.removeClient(testUUID, testWebSocketTag));
                        });
                    });
                    describe('Modifies attributes properly', () => {
                        describe('clients', () => {
                            let clientsBefore;
                            beforeEach(() => {
                                fakeWebSocketClientServiceClass.generateUUID = sinon.fake((webSocketTag) => {
                                    return testUUID;
                                });
                                fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                                clientsBefore = [];
                                for (let key in fakeWebSocketClientServiceClass.clients) {
                                    clientsBefore[key] = Object.assign({}, fakeWebSocketClientServiceClass.clients[key]);
                                }
                                fakeWebSocketClientServiceClass.removeClient(testUUID, testWebSocketTag);
                            });
                            it('Have the same number of elements like before the client removal attempt', () => {
                                assert.notEqual(fakeWebSocketClientServiceClass.clients[testWebSocketTag].length, clientsBefore[testWebSocketTag].length);
                            });
                            it('Do not have elements in the websocketTag\'s clients', () => {
                                assert.equal(fakeWebSocketClientServiceClass.clients[testWebSocketTag].length, 0);
                            });
                        });
                    });
                });
                describe('The UUID is not presented in the clients of websocketTag', () => {
                    let testWrongUUID;
                    beforeEach(() => {
                        testWrongUUID = testUUID + 'foo';
                    });
                    describe('Returns correct value', () => {
                        it('Returns boolean', () => {
                            assert.isBoolean(fakeWebSocketClientServiceClass.removeClient(testUUID, testWebSocketTag));
                        });
                        it('Returned boolean\'s value is false', () => {
                            assert.isFalse(fakeWebSocketClientServiceClass.removeClient(testUUID, testWebSocketTag));
                        });
                    });
                    describe('Modifies attributes properly', () => {
                        describe('clients', () => {
                            let clientsBefore;
                            beforeEach(() => {
                                fakeWebSocketClientServiceClass.generateUUID = sinon.fake((webSocketTag) => {
                                    return testUUID;
                                });
                                fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                                clientsBefore = [];
                                for (let key in fakeWebSocketClientServiceClass.clients) {
                                    clientsBefore[key] = fakeWebSocketClientServiceClass.clients[key];
                                }
                                fakeWebSocketClientServiceClass.removeClient(testWrongUUID, testWebSocketTag);
                            });
                            it('Have the same number of elements like before the client removal attempt', () => {
                                assert.equal(fakeWebSocketClientServiceClass.clients.length, clientsBefore.length);
                            });
                            it('Have the same elements like before the client removal attempt', () => {
                                assert.deepEqual(fakeWebSocketClientServiceClass.clients, clientsBefore);
                            });
                        });
                    });
                });
            });
            describe('The websocket tag does not presented in the clients attribute', () => {
                let testWrongWebSocketTag,
                    testWrongUUID;
                beforeEach(() => {
                    testWrongWebSocketTag = testWebSocketTag + 'foo';
                    testWrongUUID = testUUID + 'foo';
                });
                describe('Returns correct value', () => {
                    it('Returns boolean', () => {
                        assert.isBoolean(fakeWebSocketClientServiceClass.removeClient(testUUID, testWebSocketTag));
                    });
                    it('Returned boolean\'s value is false', () => {
                        assert.isFalse(fakeWebSocketClientServiceClass.removeClient(testUUID, testWebSocketTag));
                    });
                });
                describe('Modifies attributes properly', () => {
                    describe('clients', () => {
                        let clientsBefore;
                        beforeEach(() => {
                            fakeWebSocketClientServiceClass.generateUUID = sinon.fake((webSocketTag) => {
                                return testUUID;
                            });
                            fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                            clientsBefore = [];
                            for (let key in fakeWebSocketClientServiceClass.clients) {
                                clientsBefore[key] = fakeWebSocketClientServiceClass.clients[key];
                            }
                            fakeWebSocketClientServiceClass.removeClient(testWrongUUID, testWrongWebSocketTag);
                        });
                        it('Have the same number of elements like before the client removal attempt', () => {
                            assert.equal(fakeWebSocketClientServiceClass.clients.length, clientsBefore.length);
                        });
                        it('Have the same elements like before the client removal attempt', () => {
                            assert.deepEqual(fakeWebSocketClientServiceClass.clients, clientsBefore);
                        });
                    });
                });
            });
        });
        describe('getClientByUUID', () => {
            describe('The websocketTag is presented in the clients attribute', () => {
                describe('The UUID is presented between the websocketTag\'s clients', () => {
                    beforeEach(() => {
                        fakeWebSocketClientServiceClass.generateUUID = sinon.fake((webSocketTag) => {
                            return testUUID;
                        });
                        fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                    });
                    describe('Returns correct value', () => {
                        it('Returned value is object', () => {
                            assert.isObject(fakeWebSocketClientServiceClass.getClientByUUID(testUUID, testWebSocketTag));
                        });
                        it('Returned value equals with the previously added client', () => {
                            assert.equal(fakeWebSocketClientServiceClass.getClientByUUID(testUUID, testWebSocketTag), testSocket);
                        });
                    });
                });
                describe('The UUID is not presented between the websocketTag\'s clients', () => {
                    let testWrongUUID;
                    beforeEach(() => {
                        testWrongUUID = testUUID + 'foo';
                        fakeWebSocketClientServiceClass.generateUUID = sinon.fake((webSocketTag) => {
                            return testUUID;
                        });
                        fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                    });
                    describe('Returns correct value', () => {
                        it('Returned value is undefined', () => {
                            assert.isUndefined(fakeWebSocketClientServiceClass.getClientByUUID(testWrongUUID, testWebSocketTag));
                        });
                    });
                });
            });
            describe('The websocketTag is presented in the clients attribute', () => {
                let testWrongWebSocketTag;
                beforeEach(() => {
                    testWrongWebSocketTag = testWebSocketTag + 'foo';
                    fakeWebSocketClientServiceClass.generateUUID = sinon.fake((webSocketTag) => {
                        return testUUID;
                    });
                    fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                });
                describe('Returns correct value', () => {
                    it('Returned value is undefined', () => {
                        assert.isNull(fakeWebSocketClientServiceClass.getClientByUUID(testUUID, testWrongWebSocketTag));
                    });
                });
            });
        });
        describe('getClients', () => {
            describe('The websocketTag is presented in the clients attribute', () => {
                beforeEach(() => {
                    fakeWebSocketClientServiceClass.addClient(testSocket, testWebSocketTag);
                });
                describe('Returns correct value', () => {
                    it('Returns array', () => {
                        assert.isArray(fakeWebSocketClientServiceClass.getClients(testWebSocketTag));
                    });
                    it('Returned array is not empty', () => {
                        assert.isNotEmpty(Object.keys(fakeWebSocketClientServiceClass.getClients(testWebSocketTag)));
                    });
                });
            });
            describe('The websocketTag is not presented in the clients attribute', () => {
                describe('Returns correct value', () => {
                    it('Returns array', () => {
                        assert.isArray(fakeWebSocketClientServiceClass.getClients(testWebSocketTag));
                    });
                    it('Returned array is empty', () => {
                        assert.isEmpty(Object.keys(fakeWebSocketClientServiceClass.getClients(testWebSocketTag)));
                    });
                });
            });
        });
        describe('generateUUID', () => {
            describe('The \'length\' parameter have not been passed', () => {
                describe('Generated UUID not presented in the websocketTag\'s clients', () => {
                    beforeEach(() => {
                        fakeWebSocketClientServiceClass.clients[testWebSocketTag] = {};
                    });
                    describe('Returns correct value', () => {
                        it('Returns string', () => {
                            assert.isString(fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag));
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.equal(fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag).length, 8);
                        });
                    });
                    describe('Calls methods properly', () => {
                        describe('Calls \'random\' method of \'Math\' class', () => {
                            beforeEach(() => {
                                sinon.spy(Math, 'random');
                                fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag);
                            });
                            it('It have been called 8 times', () => {
                                sinon.assert.callCount(Math.random, 8);
                            });
                            afterEach(() => {
                                sinon.restore();
                            });
                        });
                        describe('Calls \'parseInt\' method', () => {
                            let oldParseInt;
                            beforeEach(() => {
                                oldParseInt = parseInt;
                                parseInt = sinon.fake((input) => {
                                    return oldParseInt(input);
                                });
                                fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag);
                            });
                            it('It have been called 8 times', () => {
                                sinon.assert.callCount(parseInt, 8);
                            });
                            afterEach(() => {
                                parseInt = oldParseInt;
                            });
                        });
                    });
                });


                
                describe('Generated UUID is presented in the websocketTag\'s clients', () => {
                    beforeEach(() => {
                        let randomRunned = 0;
                        fakeWebSocketClientServiceClass.clients[testWebSocketTag] = {
                            '00000000': {}
                        };
                        Math.random = sinon.fake(() => {
                            return Math.floor(randomRunned++ / 8) / 62;
                        });
                    });
                    describe('Returns correct value', () => {
                        it('Returns string', () => {
                            assert.isString(fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag));
                        });
                        it('Returned string\'s length is correct', () => {
                            assert.equal(fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag).length, 8);
                        });
                    });
                    describe('Calls methods properly', () => {
                        describe('Calls \'random\' method of \'Math\' class', () => {
                            beforeEach(() => {
                                fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag);
                            });
                            it('It have been called 8 times', () => {
                                sinon.assert.callCount(Math.random, 16);
                            });
                            afterEach(() => {
                                sinon.restore();
                            });
                        });
                        describe('Calls \'parseInt\' method', () => {
                            let oldParseInt;
                            beforeEach(() => {
                                oldParseInt = parseInt;
                                parseInt = sinon.fake((input) => {
                                    return oldParseInt(input);
                                });
                                fakeWebSocketClientServiceClass.generateUUID(testWebSocketTag);
                            });
                            it('It have been called 8 times', () => {
                                sinon.assert.callCount(parseInt, 16);
                            });
                            afterEach(() => {
                                parseInt = oldParseInt;
                            });
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