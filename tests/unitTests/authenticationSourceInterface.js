let assert = require('chai').assert;

describe('AuthenticationSourceInterface', () => {
    let { AuthenticationSourceInterface } = require('../../index.js'),
        FakeAuthenticationSource;
    before(() => {
        class FakeAuthenticationSourceClass extends AuthenticationSourceInterface{
        }
        FakeAuthenticationSource = FakeAuthenticationSourceClass;
    });
    describe('Abstract methods', () => {
        it('Method authenticateUser throws error', () => {
            assert.throws(FakeAuthenticationSource.authenticateUser);
        });
    });
});