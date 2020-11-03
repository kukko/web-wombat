let { assert } = require('chai'),
    sinon = require('sinon');

describe('CookieService', () => {
    let CookieService;
    before(() => {
        CookieService = require('../../src/services/CookieService/CookieService');
    });
    it('Can be loaded', () => {
        assert.isFunction(CookieService);
    });
    describe('Have basic documented methods', () => {
        it('setCookie', () => {
            assert.isFunction(CookieService.setCookie);
        });
    });
    describe('Methods works as expected', () => {
        describe('setCookie', () => {
            let testRequest,
                testResponse,
                testCookies,
                testCookieName,
                testCookieValue;
            beforeEach(() => {
                testRequest = {};
                testResponse = {
                    headers: [],
                    setHeader: function(name, value){
                        this.headers[name] = value;
                    }
                };
                testCookies = [];
                testCookieName = "foo";
                testCookieValue = "bar";
            });
            describe('There was no cookie set during the actual request', () => {
                beforeEach(() => {
                    testResponse.getHeader = () =>{
                        return [];
                    };
                });
                describe('Returns correct value', () => {
                    it('Returned value is \'undefined\'', () => {
                        assert.isUndefined(CookieService.setCookie(testRequest, testResponse, testCookieName, testCookieValue));
                    });
                });
                describe('Calls methods', () => {
                    beforeEach(() => {
                        sinon.spy(Array.prototype, 'push');
                        CookieService.setCookie(testRequest, testResponse, testCookieName, testCookieValue);
                    });
                    describe('Calls \'push\' method on \'Array\'', () => {
                        it('Called twice', () => {
                            sinon.assert.calledOnce(Array.prototype.push);
                        });
                        it('Firstly calls with correct parameters', () => {
                            assert.deepEqual(Array.prototype.push.getCall(0).args, [
                                "foo=bar"
                            ]);
                        });
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
            });
            describe('There was cookies set during the actual request', () => {
                let testSecondCookieName,
                    testSecondCookieValue,
                    previousSetCookies;
                beforeEach(() => {
                    previousSetCookies = [];
                    testResponse.getHeader = () =>{
                        return previousSetCookies;
                    };
                });
                describe('The same cookie was not set before the actual request', () => {
                    beforeEach(() => {
                        testSecondCookieName = "bar";
                        testSecondCookieValue = "foo";
                        previousSetCookies.push(testSecondCookieName + "=" + testSecondCookieValue);
                    });
                    describe('Returns correct value', () => {
                        beforeEach(() => {
                            sinon.spy(Array.prototype, 'push');
                        });
                        it('Returned value is \'undefined\'', () => {
                            assert.isUndefined(CookieService.setCookie(testRequest, testResponse, testCookieName, testCookieValue));
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            sinon.spy(Array.prototype, 'push');
                            CookieService.setCookie(testRequest, testResponse, testCookieName, testCookieValue);
                        });
                        describe('Calls \'push\' method on \'Array\'', () => {
                            it('Called twice', () => {
                                sinon.assert.calledTwice(Array.prototype.push);
                            });
                            it('Firstly calls with correct parameters', () => {
                                assert.deepEqual(Array.prototype.push.getCall(0).args, [
                                    testSecondCookieName + "=" + testSecondCookieValue
                                ]);
                            });
                            it('Secondly calls with correct parameters', () => {
                                assert.deepEqual(Array.prototype.push.getCall(1).args, [
                                    testCookieName + "=" + testCookieValue
                                ]);
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                });
                describe('The same cookie was set before the actual request', () => {
                    beforeEach(() => {
                        testSecondCookieName = testCookieName;
                        testSecondCookieValue = testCookieValue;
                        previousSetCookies.push(testSecondCookieName + "=" + testSecondCookieValue);
                    });
                    describe('Returns correct value', () => {
                        beforeEach(() => {
                            sinon.spy(Array.prototype, 'push');
                        });
                        it('Returned value is \'undefined\'', () => {
                            assert.isUndefined(CookieService.setCookie(testRequest, testResponse, testCookieName, testCookieValue));
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    describe('Calls methods', () => {
                        beforeEach(() => {
                            sinon.spy(Array.prototype, 'push');
                            CookieService.setCookie(testRequest, testResponse, testCookieName, testCookieValue);
                        });
                        describe('Calls \'push\' method on \'Array\'', () => {
                            it('Called twice', () => {
                                sinon.assert.calledOnce(Array.prototype.push);
                            });
                            it('Firstly calls with correct parameters', () => {
                                assert.deepEqual(Array.prototype.push.getCall(0).args, [
                                    testCookieName + "=" + testCookieValue
                                ]);
                            });
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
    });
});