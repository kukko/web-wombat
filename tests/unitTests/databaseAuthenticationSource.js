let assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('DatabaseAuthenticationSource', () => {
    let DatabaseAuthenticationSource = require("../../index").authenticationSources.DatabaseAuthenticationSource;
    describe('Default parameters', () => {
        it('AuthenticationCollection', () => {
            assert.equal(DatabaseAuthenticationSource.getAuthenticationCollection(), 'users');
        });
        it('IdentificationField', () => {
            assert.equal(DatabaseAuthenticationSource.getIdentificationField(), 'username');
        });
        it('AuthenticationField', () => {
            assert.equal(DatabaseAuthenticationSource.getAuthenticationField(), 'password');
        });
    });
    describe('Can set parameters', () => {
        let defaultValues;
        before(() => {
            defaultValues = {
                AuthenticationCollection: DatabaseAuthenticationSource.getAuthenticationCollection(),
                IdentificationField: DatabaseAuthenticationSource.getIdentificationField(),
                AuthenticationField: DatabaseAuthenticationSource.getAuthenticationField()
            };
            DatabaseAuthenticationSource.setAuthenticationCollection('fooCollection');
            DatabaseAuthenticationSource.setIdentificationField('fooIdentificationField');
            DatabaseAuthenticationSource.setAuthenticationField('fooAuthenticationField');
        });
        it('AuthenticationCollection', () => {
            assert.equal(DatabaseAuthenticationSource.getAuthenticationCollection(), 'fooCollection');
        });
        it('IdentificationField', () => {
            assert.equal(DatabaseAuthenticationSource.getIdentificationField(), 'fooIdentificationField');
        });
        it('AuthenticationField', () => {
            assert.equal(DatabaseAuthenticationSource.getAuthenticationField(), 'fooAuthenticationField');
        });
        after(() => {
            DatabaseAuthenticationSource.setAuthenticationCollection(defaultValues.AuthenticationCollection);
            DatabaseAuthenticationSource.setIdentificationField(defaultValues.IdentificationField);
            DatabaseAuthenticationSource.setAuthenticationField(defaultValues.AuthenticationField);
        });
    });
    describe('Can authenticate user', () => {
        let error,
            testUser,
            insertError,
            insertResult;
        before(() => {
            let { CollectionsProvider } = require('../../index.js');
            CollectionsProvider.getCollection = sinon.fake(() => {
                return {
                    collection: {
                        findOne: (parameters, callback) => {
                            return new Promise((resolve, reject) => {
                                if (!error){
                                    resolve(testUser);
                                }
                                else{
                                    reject(error);
                                }
                            });
                        },
                        insertOne: (toBeInserted, callback) => {
                            callback(insertError, insertResult);
                        }
                    }
                }
            });
        });
        it('Database error occured', (done) => {
            error = true;
            DatabaseAuthenticationSource.authenticateUser("", "").catch((e) => {
                done();
            });
        });
        describe('User not found', () => {
            before(() => {
                error = false;
                testUser = null;
            });
            it('User is null', (done) => {
                DatabaseAuthenticationSource.authenticateUser("", "").then((user) => {
                    assert.isNull(user);
                    done();
                });
            });
        });
        describe('User has found', () => {
            before(() => {
                error = false;
                testUser = {
                    username: "foo",
                    password: "bar"
                };
                DatabaseAuthenticationSource = proxyquire.load('../../src/services/AuthenticationService/AuthenticationSources/DatabaseAuthenticationSource.js', {
                    bcrypt: {
                        compare: (password, usersPassword, callback) => {
                            callback(false, password === usersPassword);
                        }
                    }
                });
                /*DatabaseAuthenticationSource.bcrypt = {
                    compare: (password, usersPassword, callback) => {
                        callback(false, password === usersPassword);
                    }
                };*/
            });
            it('Password is wrong', (done) => {
                DatabaseAuthenticationSource.authenticateUser("foo", "notBar").then((user) => {
                    assert.isNull(user);
                    done();
                });
            });
            it('Password is right', (done) => {
                DatabaseAuthenticationSource.authenticateUser("foo", "bar").then((user) => {
                    assert.equal(user, testUser);
                    done();
                });
            });
        });
        describe('The \'hashPassword\' method works as expected', () => {
            describe('Returns correct value', () => {
                it('Returns Promise', () => {
                    assert.isTrue(DatabaseAuthenticationSource.hashPassword('foo') instanceof Promise);
                });
            });
            describe('Returned Promise works as expected', () => {
                describe('Hashing was successful', () => {
                    let bcrypt;
                    beforeEach(() => {
                        DatabaseAuthenticationSource = proxyquire.load('../../src/services/AuthenticationService/AuthenticationSources/DatabaseAuthenticationSource.js', {
                            bcrypt: {
                                hash: sinon.fake((password, saltRounds, callback) => {
                                    callback(null, 'foo');
                                })
                            }
                        });
                    });
                    it('The \'hash\' method have been called from bcrypt package', (done) => {
                        DatabaseAuthenticationSource.hashPassword('foo').then(() => {
                            sinon.assert.calledOnce(DatabaseAuthenticationSource.bcrypt.hash);
                            done();
                        });
                    });
                    it('Promise resolves', (done) => {
                        DatabaseAuthenticationSource.hashPassword('foo').then(() => {
                            done();
                        });
                    });
                    afterEach(() => {
                        DatabaseAuthenticationSource.bcrypt = bcrypt;
                        DatabaseAuthenticationSource = require("../../index").authenticationSources.DatabaseAuthenticationSource;
                    });
                });
                describe('Hashing was not successfull', () => {
                    let bcrypt;
                    beforeEach(() => {
                        bcrypt = DatabaseAuthenticationSource.bcrypt;
                        DatabaseAuthenticationSource = proxyquire.load('../../src/services/AuthenticationService/AuthenticationSources/DatabaseAuthenticationSource.js', {
                            bcrypt: {
                                hash: sinon.fake((password, saltRounds, callback) => {
                                    callback(new Error(), null);
                                })
                            }
                        });
                    });
                    it('The \'hash\' method have been called from bcrypt package', (done) => {
                        DatabaseAuthenticationSource.hashPassword('foo').catch(() => {
                            sinon.assert.calledOnce(DatabaseAuthenticationSource.bcrypt.hash);
                            done();
                        });
                    });
                    it('Promise rejects', (done) => {
                        DatabaseAuthenticationSource.hashPassword('foo').catch(() => {
                            done();
                        });
                    });
                    afterEach(() => {
                        DatabaseAuthenticationSource.bcrypt = bcrypt;
                        DatabaseAuthenticationSource = require("../../index").authenticationSources.DatabaseAuthenticationSource;
                    });
                });
            });
        });
        describe('The \'addUser\' method works as expected.', () => {
            describe('The \'findOne\' method in the collection', () => {
                describe('succeeds', () => {
                    describe('A user with the username', () => {
                        describe('not exists', () => {
                            describe('The insertion of the new user was', () => {
                                describe('successful', () => {
                                    let user;
                                    before(() => {
                                        error = false;
                                        testUser = null;
                                        DatabaseAuthenticationSource.hashPassword = sinon.fake((password) => {
                                            return new Promise((resolve, reject) => {
                                                resolve(password + password);
                                            });
                                        });
                                    });
                                    describe('The returned promise resolves', () => {
                                        before(() => {
                                            insertError = false;
                                            insertResult = true;
                                            user = {
                                                password: 'foo'
                                            }
                                        });
                                        it('The hashed password have been set to the user', (done) => {
                                            DatabaseAuthenticationSource.addUser(user).then(() => {
                                                done(user.password !== 'foofoo');
                                            });
                                        });
                                    });
                                    describe('The returned promise rejects', () => {
                                        before(() => {
                                            insertError = true;
                                            insertResult = false;
                                            user = {
                                                password: 'foo'
                                            }
                                        });
                                        it('The hashed password have been set to the user', (done) => {
                                            DatabaseAuthenticationSource.addUser(user).catch(() => {
                                                done(user.password !== 'foofoo');
                                            });
                                        });
                                    });
                                });
                            });
                            describe('The returned promise rejects', () => {
                                before(() => {
                                    error = false;
                                    testUser = null;
                                    DatabaseAuthenticationSource.hashPassword = sinon.fake(() => {
                                        return new Promise((resolve, reject) => {
                                            reject(new Error('Hashing failed.'));
                                        });
                                    });
                                });
                                it('Promise rejected', (done) => {
                                    DatabaseAuthenticationSource.addUser({}).catch(() => {
                                        done();
                                    });
                                });
                                it('Promise rejects an Error', (done) => {
                                    DatabaseAuthenticationSource.addUser({}).catch((error) => {
                                        done(!(error instanceof Error));
                                    });
                                });
                                it('The rejected Error\'s message is correct', (done) => {
                                    DatabaseAuthenticationSource.addUser({}).catch((error) => {
                                        done(error.message !== "Hashing failed.");
                                    });
                                });
                            });
                        });
                        describe('exists', () => {
                            before(() => {
                                error = false;
                                testUser = {};
                            });
                            it('The returned promise rejects', (done) => {
                                DatabaseAuthenticationSource.addUser({}).catch(() => {
                                    done();
                                });
                            });
                            it('Promise rejects an Error', (done) => {
                                DatabaseAuthenticationSource.addUser({}).catch((error) => {
                                    done(!(error instanceof Error));
                                });
                            });
                            it('The rejected Error\'s message is correct', (done) => {
                                DatabaseAuthenticationSource.addUser({}).catch((error) => {
                                    done(error.message !== "The username is already in use.");
                                });
                            });
                        });
                    });
                });
                describe('fails', () => {
                    before(() => {
                        error = true;
                    });
                    it('The returned promise rejects', (done) => {
                        DatabaseAuthenticationSource.addUser({}).catch(() => {
                            done();
                        });
                    });
                });
            });
        });
        describe('The \'buildUserObject\' method works as expected.', () => {
            let testUsername,
                testPassword;
            beforeEach(() => {
                testUsername = 'foo';
                testPassword = 'bar';
                sinon.spy(DatabaseAuthenticationSource, 'getIdentificationField');
                sinon.spy(DatabaseAuthenticationSource, 'getAuthenticationField');
                DatabaseAuthenticationSource.buildUserObject(testUsername, testPassword);
            });
            it('Calls \'getIdentificationField\' method', () => {
                sinon.assert.calledOnce(DatabaseAuthenticationSource.getIdentificationField);
            });
            it('Calls \'getAuthenticationField\' method', () => {
                sinon.assert.calledOnce(DatabaseAuthenticationSource.getAuthenticationField);
            });
            describe('Returns correct value', () => {
                let testUser;
                beforeEach(() => {
                    testUser = {};
                    testUser[DatabaseAuthenticationSource.getIdentificationField()] = testUsername;
                    testUser[DatabaseAuthenticationSource.getAuthenticationField()] = testPassword;
                });
                it('Returns object', () => {
                    assert.isObject(DatabaseAuthenticationSource.buildUserObject(testUsername, testPassword));
                });
                it('Object attributes are correct', () => {
                    assert.deepEqual(DatabaseAuthenticationSource.buildUserObject(testUsername, testPassword), testUser);
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('The \'getUser\' method works as expected.', () => {
            let testUsername,
                fakeGetIdentificationField,
                fakeGetIdentificationFieldReturnValue,
                fakeGetAuthenticationCollection,
                fakeGetAuthenticationCollectionReturnValue,
                fakeFindOne,
                testUser;
            beforeEach(() => {
                testUsername = 'foo-username';
                testUser = {};
                testUser[fakeGetIdentificationField] = testUsername;
                fakeFindOne = sinon.fake(() => {
                    return new Promise((resolve, reject) => {
                        if (!(testUser instanceof Error)){
                            resolve(testUser);
                        }
                        else{
                            reject(testUser);
                        }
                    });
                });
                fakeGetCollection = sinon.fake(() => {
                    return {
                        collection: {
                            findOne: fakeFindOne
                        }
                    };
                });
                DatabaseAuthenticationSource = proxyquire.load('../../src/services/AuthenticationService/AuthenticationSources/DatabaseAuthenticationSource.js', {
                    '../../../CollectionsProvider.js': {
                        getCollection: fakeGetCollection
                    }
                });
                fakeGetIdentificationFieldReturnValue = 'foo';
                fakeGetIdentificationField = sinon.fake(() => {
                    return fakeGetIdentificationFieldReturnValue;
                });
                DatabaseAuthenticationSource.getIdentificationField = fakeGetIdentificationField;
                fakeGetAuthenticationCollectionReturnValue = 'bar';
                fakeGetAuthenticationCollection = sinon.fake(() => {
                    return fakeGetAuthenticationCollectionReturnValue;
                });
                DatabaseAuthenticationSource.getAuthenticationCollection = fakeGetAuthenticationCollection;
            });
            describe('User was found', () => {
                describe('Returns correct value', () => {
                    it('Returns promise', () => {
                        assert.instanceOf(DatabaseAuthenticationSource.getUser(testUsername), Promise);
                    });
                    it('Returned promise resolves', (done) => {
                        DatabaseAuthenticationSource.getUser(testUsername).then(() => {
                            done();
                        });
                    });
                    it('Returned promise resolves correct value', (done) => {
                        DatabaseAuthenticationSource.getUser(testUsername).then((user) => {
                            assert.equal(user, testUser);
                            done();
                        });
                    });
                });
                describe('Calls methods', () => {
                    describe('Calls \'getIdentificationField\' method of \'DatabaseAuthenticationSource\' class', () => {
                        it('Called once', (done) => {
                            DatabaseAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.calledOnce(fakeGetIdentificationField);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            DatabaseAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.calledWithExactly(fakeGetIdentificationField);
                                done();
                            });
                        });
                    });
                    describe('Calls \'getAuthenticationCollection\' method of \'DatabaseAuthenticationSource\' class', () => {
                        it('Called once', (done) => {
                            DatabaseAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.calledOnce(fakeGetAuthenticationCollection);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            DatabaseAuthenticationSource.getUser(testUsername).then(() => {
                                sinon.assert.calledWithExactly(fakeGetAuthenticationCollection);
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('The \'changePassword\' method works as expected.', () => {
            let testUsername,
                testPassword,
                testUser,
                passwordHash,
                updateResult,
                fakeGetAuthenticationField,
                fakeGetAuthenticationFieldReturnValue,
                fakeGetAuthenticationCollection,
                fakeGetAuthenticationCollectionReturnValue,
                fakeGetCollection,
                fakeUpdateOne,
                fakeHashPassword,
                fakeGetUser,
                testErrorMessage;
            beforeEach(() => {
                testUsername = 'foo-user';
                testPassword = 'foo-password';
                fakeUpdateOne = sinon.fake(() => {
                    return new Promise((resolve, reject) => {
                        if (!(updateResult instanceof Error)){
                            resolve(updateResult);
                        }
                        else{
                            reject(updateResult);
                        }
                    });
                });
                fakeGetCollection = sinon.fake(() => {
                    return {
                        collection: {
                            updateOne: fakeUpdateOne
                        }
                    };
                });
                DatabaseAuthenticationSource = proxyquire.load('../../src/services/AuthenticationService/AuthenticationSources/DatabaseAuthenticationSource.js', {
                    '../../../CollectionsProvider.js': {
                        getCollection: fakeGetCollection
                    }
                });
                fakeHashPassword = sinon.fake(() => {
                    return new Promise((resolve, reject) => {
                        if (!(passwordHash instanceof Error)){
                            resolve(passwordHash);
                        }
                        else{
                            reject(passwordHash);
                        }
                    });
                });
                DatabaseAuthenticationSource.hashPassword = fakeHashPassword;
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
                DatabaseAuthenticationSource.getUser = fakeGetUser;
                fakeGetAuthenticationCollectionReturnValue = 'foo';
                fakeGetAuthenticationCollection = sinon.fake(() => {
                    return fakeGetAuthenticationCollectionReturnValue;
                });
                DatabaseAuthenticationSource.getAuthenticationCollection = fakeGetAuthenticationCollection;
                fakeGetAuthenticationFieldReturnValue = 'foo-field';
                fakeGetAuthenticationField = sinon.fake(() => {
                    return fakeGetAuthenticationFieldReturnValue;
                });
                DatabaseAuthenticationSource.getAuthenticationField = fakeGetAuthenticationField;
            });
            describe('The user was found', () => {
                beforeEach(() => {
                    testUser = {};
                });
                describe('The password hashing was successful', () => {
                    beforeEach(() => {
                        passwordHash = 'bar';
                    });
                    describe('The update of user was successful', () => {
                        beforeEach(() => {
                            updateResult = {};
                        });
                        describe('Returns correct value', () => {
                            it('Returns promise', () => {
                                assert.instanceOf(DatabaseAuthenticationSource.changePassword(testUsername, testPassword), Promise);
                            });
                            it('Returned promise resolves', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                    done();
                                });
                            });
                            it('Returned promise resolves correct value', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then((result) => {
                                    assert.equal(result, true);
                                    done();
                                });
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls \'getUser\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledOnce(fakeGetUser);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledWithExactly(fakeGetUser, testUsername);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'hashPassword\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledOnce(fakeHashPassword);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledWithExactly(fakeHashPassword, testPassword);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'getAuthenticationField\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledOnce(fakeGetAuthenticationField);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledWithExactly(fakeGetAuthenticationField);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'getAuthenticationCollection\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledOnce(fakeGetAuthenticationCollection);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledWithExactly(fakeGetAuthenticationCollection);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'getCollection\' method of \'CollectionsProvider\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledOnce(fakeGetCollection);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).then(() => {
                                        sinon.assert.calledWithExactly(fakeGetCollection, fakeGetAuthenticationCollectionReturnValue);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                    describe('The update of user was not successful', () => {
                        beforeEach(() => {
                            testErrorMessage = 'Something went wrong during the update of user.';
                            updateResult = new Error(testErrorMessage);
                        });
                        describe('Returns correct value', () => {
                            it('Returns promise', () => {
                                let returnedPromise = DatabaseAuthenticationSource.changePassword(testUsername, testPassword);
                                returnedPromise.catch(() => {
                                });
                                assert.instanceOf(returnedPromise, Promise);
                            });
                            it('Returned promise rejects', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    done();
                                });
                            });
                            it('Returned promise rejects correct value', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch((error) => {
                                    assert.equal(error, updateResult);
                                    done();
                                });
                            });
                            it('Rejected error\'s message is correct', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch((error) => {
                                    assert.equal(error.message, testErrorMessage);
                                    done();
                                });
                            });
                        });
                        describe('Calls methods', () => {
                            describe('Calls \'getUser\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledOnce(fakeGetUser);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledWithExactly(fakeGetUser, testUsername);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'hashPassword\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledOnce(fakeHashPassword);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledWithExactly(fakeHashPassword, testPassword);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'getAuthenticationField\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledOnce(fakeGetAuthenticationField);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledWithExactly(fakeGetAuthenticationField);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'getAuthenticationCollection\' method of \'DatabaseAuthenticationSource\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledOnce(fakeGetAuthenticationCollection);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledWithExactly(fakeGetAuthenticationCollection);
                                        done();
                                    });
                                });
                            });
                            describe('Calls \'getCollection\' method of \'CollectionsProvider\' class', () => {
                                it('Called once', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledOnce(fakeGetCollection);
                                        done();
                                    });
                                });
                                it('Called with correct parameters', (done) => {
                                    DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                        sinon.assert.calledWithExactly(fakeGetCollection, fakeGetAuthenticationCollectionReturnValue);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
                describe('The password hashing was not successful', () => {
                    beforeEach(() => {
                        testErrorMessage = 'Something went wrong during the hashing of password.';
                        passwordHash = new Error(testErrorMessage);
                    });
                    describe('Returns correct value', () => {
                        it('Returns promise', () => {
                            let returnedPromise = DatabaseAuthenticationSource.changePassword(testUsername, testPassword);
                            returnedPromise.catch(() => {
                            });
                            assert.instanceOf(returnedPromise, Promise);
                        });
                        it('Returned promise rejects', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                done();
                            });
                        });
                        it('Returned promise rejects correct value', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch((error) => {
                                assert.equal(error, passwordHash);
                                done();
                            });
                        });
                        it('Rejected error\'s message is correct', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch((error) => {
                                assert.equal(error.message, testErrorMessage);
                                done();
                            });
                        });
                    });
                    describe('Calls methods', () => {
                        describe('Calls \'getUser\' method of \'DatabaseAuthenticationSource\' class', () => {
                            it('Called once', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    sinon.assert.calledOnce(fakeGetUser);
                                    done();
                                });
                            });
                            it('Called with correct parameters', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    sinon.assert.calledWithExactly(fakeGetUser, testUsername);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'hashPassword\' method of \'DatabaseAuthenticationSource\' class', () => {
                            it('Called once', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    sinon.assert.calledOnce(fakeHashPassword);
                                    done();
                                });
                            });
                            it('Called with correct parameters', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    sinon.assert.calledWithExactly(fakeHashPassword, testPassword);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'getAuthenticationField\' method of \'DatabaseAuthenticationSource\' class', () => {
                            it('Not called', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    sinon.assert.notCalled(fakeGetAuthenticationField);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'getAuthenticationCollection\' method of \'DatabaseAuthenticationSource\' class', () => {
                            it('Not called', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    sinon.assert.notCalled(fakeGetAuthenticationCollection);
                                    done();
                                });
                            });
                        });
                        describe('Calls \'getCollection\' method of \'CollectionsProvider\' class', () => {
                            it('Not called', (done) => {
                                DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                    sinon.assert.notCalled(fakeGetCollection);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
            describe('The user was not found', () => {
                beforeEach(() => {
                    testErrorMessage = 'Something went wrong during the search of the user.';
                    testUser = new Error(testErrorMessage);
                });
                describe('Returns correct value', () => {
                    it('Returns promise', () => {
                        let returnedPromise = DatabaseAuthenticationSource.changePassword(testUsername, testPassword);
                        returnedPromise.catch(() => {
                        });
                        assert.instanceOf(returnedPromise, Promise);
                    });
                    it('Returned promise rejects', (done) => {
                        DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                            done();
                        });
                    });
                    it('Returned promise rejects correct value', (done) => {
                        DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch((error) => {
                            assert.equal(error, testUser);
                            done();
                        });
                    });
                    it('Rejected error\'s message is correct', (done) => {
                        DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch((error) => {
                            assert.equal(error.message, testErrorMessage);
                            done();
                        });
                    });
                });
                describe('Calls methods', () => {
                    describe('Calls \'getUser\' method of \'DatabaseAuthenticationSource\' class', () => {
                        it('Called once', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                sinon.assert.calledOnce(fakeGetUser);
                                done();
                            });
                        });
                        it('Called with correct parameters', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                sinon.assert.calledWithExactly(fakeGetUser, testUsername);
                                done();
                            });
                        });
                    });
                    describe('Calls \'hashPassword\' method of \'DatabaseAuthenticationSource\' class', () => {
                        it('Not called', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                sinon.assert.notCalled(fakeHashPassword);
                                done();
                            });
                        });
                    });
                    describe('Calls \'getAuthenticationField\' method of \'DatabaseAuthenticationSource\' class', () => {
                        it('Not called', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                sinon.assert.notCalled(fakeGetAuthenticationField);
                                done();
                            });
                        });
                    });
                    describe('Calls \'getAuthenticationCollection\' method of \'DatabaseAuthenticationSource\' class', () => {
                        it('Not called', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                sinon.assert.notCalled(fakeGetAuthenticationCollection);
                                done();
                            });
                        });
                    });
                    describe('Calls \'getCollection\' method of \'CollectionsProvider\' class', () => {
                        it('Not called', (done) => {
                            DatabaseAuthenticationSource.changePassword(testUsername, testPassword).catch(() => {
                                sinon.assert.notCalled(fakeGetCollection);
                                done();
                            });
                        });
                    });
                });
            });
        });
        after(() => {
            sinon.restore();
        });
    });
});