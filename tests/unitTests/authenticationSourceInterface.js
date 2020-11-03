let assert = require('chai').assert;

describe('AuthenticationSourceInterface', () => {
    let { AuthenticationSourceInterface } = require('../../index.js'),
        FakeAuthenticationSource;
    before(() => {
        class FakeAuthenticationSourceClass extends AuthenticationSourceInterface {
        }
        FakeAuthenticationSource = FakeAuthenticationSourceClass;
    });
    describe('Have basic documented methods', () => {
        it('authenticateUser', () => {
            assert.isFunction(FakeAuthenticationSource.authenticateUser);
        });
        it('addUser', () => {
            assert.isFunction(FakeAuthenticationSource.addUser);
        });
        it('buildUserObject', () => {
            assert.isFunction(FakeAuthenticationSource.buildUserObject);
        });
        it('getUser', () => {
            assert.isFunction(FakeAuthenticationSource.getUser);
        });
        it('changePassword', () => {
            assert.isFunction(FakeAuthenticationSource.changePassword);
        });
    });
    describe('Abstract methods', () => {
        it('Method \'authenticateUser\' throws error', () => {
            assert.throws(FakeAuthenticationSource.authenticateUser);
        });
        it('Method \'addUser\' throws error', () => {
            assert.throws(FakeAuthenticationSource.addUser);
        });
        it('Method \'buildUserObject\' throws error', () => {
            assert.throws(FakeAuthenticationSource.buildUserObject);
        });
        it('Method \'getUser\' throws error', () => {
            assert.throws(FakeAuthenticationSource.getUser);
        });
        it('Method \'changePassword\' throws error', () => {
            assert.throws(FakeAuthenticationSource.changePassword);
        });
    });
});