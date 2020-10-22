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
                            callback(error, testUser);
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
        after(() => {
            sinon.restore();
        });
    });
});