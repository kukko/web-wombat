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
        afterEach(() => {
            MemoryAuthenticationSource.clearUsers();
        });
    });
});