const { changePassword } = require('../../src/services/AuthenticationService/AuthenticationSourceInterface');

let assert = require('chai').assert,
    sinon = require('sinon');

describe('MemoryAuthenticationSource', () => {
    let MemoryAuthenticationSource = require("../../index").authenticationSources.MemoryAuthenticationSource;
    describe('Default parameters', () => {
        it('AuthenticationCollection', () => {
            assert.deepEqual(MemoryAuthenticationSource.getUsers(), []);
        });
        it('IdentificationField', () => {
            assert.equal(MemoryAuthenticationSource.getIdentificationField(), 'username');
        });
        it('AuthenticationField', () => {
            assert.equal(MemoryAuthenticationSource.getAuthenticationField(), 'password');
        });
    });
    describe('Methods works as expected', () => {
        let testUsers = [
                {
                    username: "foo",
                    password: "bar"
                },
                {
                    username: "bar",
                    password: "foo"
                }
            ];
        beforeEach(() => {
            defaultUsers = MemoryAuthenticationSource.getUsers();
        });
        it('getUsers', () => {
            assert.isArray(MemoryAuthenticationSource.getUsers());
        });
        it('setUsers', () => {
            MemoryAuthenticationSource.setUsers(testUsers);
            assert.deepEqual(MemoryAuthenticationSource.getUsers(), testUsers);
        });
        it('clearUsers', () => {
            MemoryAuthenticationSource.setUsers(testUsers);
            MemoryAuthenticationSource.clearUsers();
            assert.deepEqual(MemoryAuthenticationSource.getUsers(), []);
        });
        describe('addUser', () => {
            it('Set empty array into users if it is undefined', () => {
                MemoryAuthenticationSource.setUsers();
                MemoryAuthenticationSource.addUser(testUsers[0]);
                assert.deepEqual(MemoryAuthenticationSource.getUsers(), [
                    testUsers[0]
                ]);
            });
            describe('Can not add user', () => {
                it('Without identification field', (done) => {
                    MemoryAuthenticationSource.addUser({
                        password: "bar"
                    }).catch((error) => {
                        done(error.message !== "This user don't have the `username` attribute.");
                    });
                });
                it('Without authentication field', (done) => {
                    MemoryAuthenticationSource.addUser({
                        username: "foo"
                    }).catch((error) => {
                        done(error.message !== "This user don't have the `password` attribute.");
                    });
                });
                it('When another user with the same identification field is already added', (done) => {
                    MemoryAuthenticationSource.addUser({
                        username: "foo",
                        password: "bar"
                    });
                    MemoryAuthenticationSource.addUser({
                        username: "foo",
                        password: "bar"
                    }).catch((error) => {
                        done(error.message !== "A user with the same `username` attribute exists.");
                    });
                });
            });
            it('Add user to the authenticable users', () => {
                MemoryAuthenticationSource.addUser(testUsers[0]);
                assert.deepEqual(MemoryAuthenticationSource.getUsers(), [
                    testUsers[0]
                ]);
            });
        });
        describe('Can authenticate user', () => {
            describe('User not found', () => {
                beforeEach(() => {
                    MemoryAuthenticationSource.setUsers(testUsers);
                });
                it('User is null', (done) => {
                    MemoryAuthenticationSource.authenticateUser("notFoo", "bar").then((user) => {
                        assert.isNull(user);
                        done();
                    });
                });
            });
        });
        describe('User has found', () => {
            let testUser = {
                username: "foo",
                password: "bar"
            };
            beforeEach(() => {
                MemoryAuthenticationSource.clearUsers();
                MemoryAuthenticationSource.addUser(testUser);
            });
            it('Password is wrong', (done) => {
                MemoryAuthenticationSource.authenticateUser("foo", "notBar").then((user) => {
                    assert.isNull(user);
                    done();
                });
            });
            it('Password is right', (done) => {
                MemoryAuthenticationSource.authenticateUser("foo", "bar").then((user) => {
                    assert.equal(user, testUser);
                    done();
                });
            });
        });
        describe('The \'buildUserObject\' method works as expected.', () => {
            let testUsername,
                testPassword;
            beforeEach(() => {
                testUsername = 'foo';
                testPassword = 'bar';
                sinon.spy(MemoryAuthenticationSource, 'getIdentificationField');
                sinon.spy(MemoryAuthenticationSource, 'getAuthenticationField');
                MemoryAuthenticationSource.buildUserObject(testUsername, testPassword);
            });
            it('Calls \'getIdentificationField\' method', () => {
                sinon.assert.calledOnce(MemoryAuthenticationSource.getIdentificationField);
            });
            it('Calls \'getAuthenticationField\' method', () => {
                sinon.assert.calledOnce(MemoryAuthenticationSource.getAuthenticationField);
            });
            describe('Returns correct value', () => {
                let testUser;
                beforeEach(() => {
                    testUser = {};
                    testUser[MemoryAuthenticationSource.getIdentificationField()] = testUsername;
                    testUser[MemoryAuthenticationSource.getAuthenticationField()] = testPassword;
                });
                it('Returns object', () => {
                    assert.isObject(MemoryAuthenticationSource.buildUserObject(testUsername, testPassword));
                });
                it('Object attributes are correct', () => {
                    assert.deepEqual(MemoryAuthenticationSource.buildUserObject(testUsername, testPassword), testUser);
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('getUser', () => {
            let getUsersBefore,
                fakeGetUsers,
                getIdentificationFieldBefore,
                fakeGetUsersReturnValue,
                fakeGetIdentificationField,
                fakeGetIdentificationFieldReturnValue,
                testUser,
                testUsername;
            beforeEach(() => {
                fakeGetIdentificationFieldReturnValue = 'foo';
                fakeGetIdentificationField = sinon.fake(() => {
                    return fakeGetIdentificationFieldReturnValue;
                });
                getIdentificationFieldBefore = MemoryAuthenticationSource.getIdentificationField;
                MemoryAuthenticationSource.getIdentificationField = fakeGetIdentificationField;
                testUsername = 'foo';
                testUser = {
                };
                testUser[fakeGetIdentificationFieldReturnValue] = testUsername;
                fakeGetUsersReturnValue = [
                    testUser
                ];
                fakeGetUsers = sinon.fake(() => {
                    return fakeGetUsersReturnValue;
                });
                getUsersBefore = MemoryAuthenticationSource.getUsers;
                MemoryAuthenticationSource.getUsers = fakeGetUsers;
            });
            describe('User was found', () => {
                describe('Returns correct value', () => {
                    it('Returns promise', () => {
                        assert.instanceOf(MemoryAuthenticationSource.getUser(testUsername), Promise);
                    });
                    it('Returned promise resolves', (done) => {
                        MemoryAuthenticationSource.getUser(testUsername).then(() => {
                            done();
                        });
                    });
                    it('Returned promise resolves correct value', (done) => {
                        MemoryAuthenticationSource.getUser(testUsername).then((user) => {
                            assert.equal(user, testUser);
                            done();
                        });
                    });
                });
                describe('Calls methods', () => {
                    describe('Calls \'getUsers\' method of \'MemoryAuthenticationSource\' class', () => {
                        it('Called twice', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.calledTwice(fakeGetUsers);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.alwaysCalledWithExactly(fakeGetUsers);
                                done();
                            });
                        });
                    });
                    describe('Calls \'getIdentificationField\' method of \'MemoryAuthenticationSource\' class', () => {
                        it('Called twice', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.calledOnce(fakeGetIdentificationField);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.alwaysCalledWithExactly(fakeGetIdentificationField);
                                done();
                            });
                        });
                    });
                });
            });
            describe('User was not found', () => {
                beforeEach(() => {
                    testUsername += 'foo';
                });
                describe('Returns correct value', () => {
                    it('Returns promise', () => {
                        let returnedPromise = MemoryAuthenticationSource.getUser(testUsername);
                        returnedPromise.catch(() => {
                        });
                        assert.instanceOf(returnedPromise, Promise);
                    });
                    it('Returned promise rejects', (done) => {
                        MemoryAuthenticationSource.getUser(testUsername).catch(() => {
                            done();
                        });
                    });
                    it('Returned promise rejects correct value', (done) => {
                        MemoryAuthenticationSource.getUser(testUsername).catch((user) => {
                            assert.equal(user, null);
                            done();
                        });
                    });
                });
                describe('Calls methods', () => {
                    describe('Calls \'getUsers\' method of \'MemoryAuthenticationSource\' class', () => {
                        it('Called twice', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).catch(() => {
                                sinon.assert.calledTwice(fakeGetUsers);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).catch(() => {
                                sinon.assert.alwaysCalledWithExactly(fakeGetUsers);
                                done();
                            });
                        });
                    });
                    describe('Calls \'getIdentificationField\' method of \'MemoryAuthenticationSource\' class', () => {
                        it('Called twice', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).catch(() => {
                                sinon.assert.calledOnce(fakeGetIdentificationField);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            MemoryAuthenticationSource.getUser(testUsername).catch(() => {
                                sinon.assert.alwaysCalledWithExactly(fakeGetIdentificationField);
                                done();
                            });
                        });
                    });
                });
            });
            afterEach(() => {
                MemoryAuthenticationSource.getIdentificationField = getIdentificationFieldBefore;
                MemoryAuthenticationSource.getUsers = getUsersBefore;
            });
        });
        describe('changePassword', () => {
            let getUserBefore,
                fakeGetUser,
                testUsername,
                testUser,
                getAuthenticationFieldBefore,
                fakeGetAuthenticationField,
                fakeGetAuthenticationFieldReturnValue;
            beforeEach(() => {
                fakeGetAuthenticationFieldReturnValue = 'foo';
                fakeGetAuthenticationField = sinon.fake(() => {
                    return fakeGetAuthenticationFieldReturnValue;
                });
                getAuthenticationFieldBefore = MemoryAuthenticationSource.getAuthenticationField;
                MemoryAuthenticationSource.getAuthenticationField = fakeGetAuthenticationField;
                testUser = {};
                testUsername = 'foo-username';
                testPassword = 'foo-password';
                testUser[fakeGetAuthenticationFieldReturnValue] = testUsername
                fakeGetUser = sinon.fake(() => {
                    return new Promise((resolve, reject) => {
                        if (!(testUser instanceof Error)){
                            resolve(testUser);
                        }
                        else{
                            reject(testUser);
                        }
                    });
                });
                getUserBefore = MemoryAuthenticationSource.getUser;
                MemoryAuthenticationSource.getUser = fakeGetUser;
            });
            describe('User was found', () => {
                describe('Returns correct value', () => {
                    it('Returns promise', () => {
                        assert.instanceOf(MemoryAuthenticationSource.changePassword(testUsername, testPassword), Promise);
                    });
                    it('Returned promise resolves', (done) => {
                        MemoryAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                            done();
                        });
                    });
                    it('Returned promise resolves correct value', (done) => {
                        MemoryAuthenticationSource.changePassword(testUsername, testPassword).then((result) => {
                            assert.equal(result, true);
                            done();
                        });
                    });
                });
                describe('Calls methods', () => {
                    describe('Calls \'getUser\' method of \'MemoryAuthenticationSource\' class', () => {
                        it('Called once', (done) => {
                            MemoryAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                sinon.assert.calledOnce(fakeGetUser);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            MemoryAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                sinon.assert.alwaysCalledWithExactly(fakeGetUser, testUsername);
                                done();
                            });
                        });
                    });
                    describe('Calls \'getAuthenticationField\' method of \'MemoryAuthenticationSource\' class', () => {
                        it('Called once', (done) => {
                            MemoryAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                sinon.assert.calledOnce(fakeGetAuthenticationField);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            MemoryAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                sinon.assert.alwaysCalledWithExactly(fakeGetAuthenticationField);
                                done();
                            });
                        });
                    });
                });
                describe('Modifies user correctly', () => {
                    it('Sets authentication field to the new password', (done) => {
                        MemoryAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                            assert.equal(testUser[fakeGetAuthenticationFieldReturnValue], testPassword);
                            done();
                        });
                    });
                });
            });
            afterEach(() => {
                MemoryAuthenticationSource.getAuthenticationField = getAuthenticationFieldBefore;
                MemoryAuthenticationSource.getUser = getUserBefore;
            });
        });
        afterEach(() => {
            MemoryAuthenticationSource.clearUsers();
        });
    });
});