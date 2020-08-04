let assert = require('chai').assert,
    sinon = require('sinon');

describe('FormBuilder', () => {
    let FormBuilder;
    before(() => {
        FormBuilder = require('../../index.js').FormBuilder;
    });
    it('Can be loaded', () => {
        assert.isFunction(FormBuilder);
    });
    describe('Have basic documented static methods', () => {
        it('formMethodInput', () => {
            assert.isFunction(FormBuilder.formMethodInput);
        });
    });
    describe('Methods works as expected', () => {
        describe('formMethodInput', () => {
            let testMethod;
            beforeEach(() => {
                testMethod = 'GET';
            });
            it('Returns string', () => {
                assert.isString(FormBuilder.formMethodInput(testMethod));
            });
            it('Returned string is correct', () => {
                assert.equal(FormBuilder.formMethodInput(testMethod), "<input type='hidden' name='_form_method' value='" + testMethod + "'>");
            });
        });
    });
});