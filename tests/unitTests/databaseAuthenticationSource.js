let assert = require('chai').assert,
    sinon = require('sinon');

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
            testUser;
        before(() => {
            let { CollectionsProvider } = require('../../index.js');
            CollectionsProvider.getCollection = sinon.fake(() => {
                return {
                    findOne: (parameters, callback) => {
                        callback(error, testUser);
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
                DatabaseAuthenticationSource.bcrypt = {
                    compare: (password, usersPassword, callback) => {
                        callback(false, password === usersPassword);
                    }
                };
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
        after(() => {
            sinon.restore();
        });
    });
});