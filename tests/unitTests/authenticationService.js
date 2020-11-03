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
            describe('Uses \'authenticateUser\' method of authentication source', () => {
                before(() => {
                    AuthenticationService.authenticateUser("foo", "bar");
                });
                it('The \'authenticateUser\' method of authentication source is called', () => {
                    sinon.assert.calledOnce(FakeAuthenticationSource.authenticateUser);
                });
                it('The \'authenticateUser\' method of authentication source is called with right parameters', () => {
                    assert.deepEqual(FakeAuthenticationSource.authenticateUser.getCall(0).args, [
                        'foo',
                        'bar'
                    ]);
                });
            });
        });
        describe('addUser', () => {
            before(() => {
                class FakeAuthenticationSourceClass extends AuthenticationSourceInterface{
                }
                FakeAuthenticationSourceClass.addUser = sinon.fake();
                FakeAuthenticationSource = FakeAuthenticationSourceClass;
                AuthenticationService.setAuthenticationSource(FakeAuthenticationSource);
            });
            describe('Uses \'addUser\' method of authentication source', () => {
                let testUser;
                before(() => {
                    testUser = {};
                    AuthenticationService.addUser(testUser);
                });
                it('The \'addUser\' method of authentication source is called', () => {
                    sinon.assert.calledOnce(FakeAuthenticationSource.addUser);
                });
                it('The \'addUser\' method of authentication source is called with right parameters', () => {
                    assert.deepEqual(FakeAuthenticationSource.addUser.getCall(0).args, [
                        testUser
                    ]);
                });
            });
        });
        describe('buildUserObject', () => {
            before(() => {
                class FakeAuthenticationSourceClass extends AuthenticationSourceInterface{
                }
                FakeAuthenticationSourceClass.buildUserObject = sinon.fake();
                FakeAuthenticationSource = FakeAuthenticationSourceClass;
                AuthenticationService.setAuthenticationSource(FakeAuthenticationSource);
            });
            describe('Uses \'buildUserObject\' method of authentication source', () => {
                let testUsername,
                    testPassword;
                before(() => {
                    testUsername = 'foo';
                    testPassword = 'bar';
                    AuthenticationService.buildUserObject(testUsername, testPassword);
                });
                it('The \'buildUserObject\' method of authentication source is called', () => {
                    sinon.assert.calledOnce(FakeAuthenticationSource.buildUserObject);
                });
                it('The \'buildUserObject\' method of authentication source is called with right parameters', () => {
                    assert.deepEqual(FakeAuthenticationSource.buildUserObject.getCall(0).args, [
                        testUsername,
                        testPassword
                    ]);
                });
            });
        });
        describe('getUser', () => {
            before(() => {
                class FakeAuthenticationSourceClass extends AuthenticationSourceInterface{
                }
                FakeAuthenticationSourceClass.getUser = sinon.fake();
                FakeAuthenticationSource = FakeAuthenticationSourceClass;
                AuthenticationService.setAuthenticationSource(FakeAuthenticationSource);
            });
            describe('Uses \'getUser\' method of authentication source', () => {
                before(() => {
                    AuthenticationService.getUser("foo");
                });
                it('The \'getUser\' method of authentication source is called', () => {
                    sinon.assert.calledOnce(FakeAuthenticationSource.getUser);
                });
                it('The \'getUser\' method of authentication source is called with right parameters', () => {
                    assert.deepEqual(FakeAuthenticationSource.getUser.getCall(0).args, [
                        'foo'
                    ]);
                });
            });
        });
        describe('changePassword', () => {
            before(() => {
                class FakeAuthenticationSourceClass extends AuthenticationSourceInterface{
                }
                FakeAuthenticationSourceClass.changePassword = sinon.fake();
                FakeAuthenticationSource = FakeAuthenticationSourceClass;
                AuthenticationService.setAuthenticationSource(FakeAuthenticationSource);
            });
            describe('Uses \'changePassword\' method of authentication source', () => {
                before(() => {
                    AuthenticationService.changePassword("foo", "bar");
                });
                it('The \'changePassword\' method of authentication source is called', () => {
                    sinon.assert.calledOnce(FakeAuthenticationSource.changePassword);
                });
                it('The \'changePassword\' method of authentication source is called with right parameters', () => {
                    assert.deepEqual(FakeAuthenticationSource.changePassword.getCall(0).args, [
                        'foo',
                        'bar'
                    ]);
                });
            });
        });
    });
});