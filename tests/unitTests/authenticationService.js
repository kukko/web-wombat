let { assert } = require('chai'),
    sinon = require('sinon');

describe('AuthenticationService', () => {
    let { AuthenticationService, AuthenticationSourceInterface } = require('../../index.js'),
        FakeAuthenticationSource,
        NotAFakeAuthenticationSource;
    before(() => {
        class FakeAuthenticationSourceClass extends AuthenticationSourceInterface{
        }
        class NotAFakeAuthenticationSourceClass{
        }
        FakeAuthenticationSource = FakeAuthenticationSourceClass;
        NotAFakeAuthenticationSource = NotAFakeAuthenticationSourceClass;
    });
	describe('Methods works as expected', () => {
        describe('setAuthenticationSource', () => {
            it('Passed wrong auth source', () => {
                assert.throws(() => {
                    AuthenticationService.setAuthenticationSource(NotAFakeAuthenticationSource);
                });
            });
            it('Passed right auth source', () => {
                assert.doesNotThrow(() => {
                    AuthenticationService.setAuthenticationSource(FakeAuthenticationSource);
                });
            });
        });
        describe('authenticateUser', () => {
            before(() => {
                class FakeAuthenticationSourceClass extends AuthenticationSourceInterface{
                }
                FakeAuthenticationSourceClass.authenticateUser = sinon.fake();
                FakeAuthenticationSource = FakeAuthenticationSourceClass;
                AuthenticationService.setAuthenticationSource(FakeAuthenticationSource);
            });
            describe('Uses authenticateUser method of authentication source', () => {
                before(() => {
                    AuthenticationService.authenticateUser("foo", "bar");
                });
                it('The authenticateUser method of authentication source is called', () => {
                    sinon.assert.calledOnce(FakeAuthenticationSource.authenticateUser);
                });
                it('The authenticateUser method of authentication source is called with right parameters', () => {
                    assert.deepEqual(FakeAuthenticationSource.authenticateUser.getCall(0).args, [
                        'foo',
                        'bar'
                    ]);
                });
            });
        });
    });
});