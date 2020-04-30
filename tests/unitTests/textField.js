let { assert } = require('chai'),
    sinon = require('sinon');

describe('TextField', () => {
    let TextField;
    before(() => {
        TextField = require('../../index.js').fieldTypes.TextField;
    });
    it('Can load TextField', () => {
        assert.isFunction(TextField);
    });
    describe('Attributes have correct values by default', () => {
        let TestField;
        before(() => {
            TestField = new TextField();
        });
        it('Placeholder is undefined', () => {
            assert.isUndefined(TestField._placeholder);
        });
    });
    describe('Methods works correctly', () => {
        let TestField,
            testParameters = {
                name: 'testName',
                placeholder: 'testPlaceholder',
                value: 'testValue',
                label: 'testLabel'
            };
        describe('setPlaceholder', () => {
            describe('The \'label\' attribute haven\'t been set', () => {
                before(() => {
                    TestField = new TextField();
                    TestField.setLabel();
                    TestField.setPlaceholder(testParameters.placeholder);
                });
                it('The \'placeholder\' attribute have been set correctly', () => {
                    assert.equal(TestField._placeholder, testParameters.placeholder);
                });
                it('The \'label\' attribute have been set correctly', () => {
                    assert.equal(TestField.getLabel(), testParameters.placeholder);
                });
            });
            describe('The \'label\' attribute have been set', () => {
                before(() => {
                    TestField = new TextField();
                    TestField.setLabel(testParameters.label);
                    TestField.setPlaceholder(testParameters.placeholder);
                });
                it('The \'placeholder\' attribute have been set correctly', () => {
                    assert.equal(TestField._placeholder, testParameters.placeholder);
                });
                it('The \'label\' attribute haven\'t been set correctly', () => {
                    assert.equal(TestField.getLabel(), testParameters.label);
                });
            });
        });
        describe('Getter for \'placeholder\' attribute', () => {
            before(() => {
                TestField = new TextField(testParameters.name);
            });
            describe('Placeholder is undefined', () => {
                before(() => {
                    TestField.setPlaceholder();
                });
                it('Returns the \'name\' attribute', () => {
                    assert.equal(TestField.placeholder, testParameters.name);
                });
            });
            describe('Placeholder is undefined', () => {
                before(() => {
                    TestField.setPlaceholder(testParameters.placeholder);
                });
                it('Returns correct value', () => {
                    assert.equal(TestField.placeholder, testParameters.placeholder);
                });
            });
        });
        describe('toString', () => {
            before(() => {
                TestField = new TextField(testParameters.name);
                TestField.setPlaceholder(testParameters.placeholder);
                TestField.setValue(testParameters.value);
            });
            it('The \'editable\' parameter is false', () => {
                assert.equal(TestField.toString(false), TestField.label + ": " + TestField.value);
            });
            describe('The \'editable\' parameter is true', () => {
                describe('The \'showable\' attribute is false', () => {
                    before(() => {
                        TestField.setShowable(false);
                    });
                    it('Returns correct value', () => {
                        assert.equal(TestField.toString(true), "<input type='text' name='" +
                        testParameters.name +
                        "' placeholder='" +
                        testParameters.placeholder +
                        "' value='" +
                        undefined +
                        "'>");
                    });
                });
                describe('The \'showable\' attribute is true', () => {
                    before(() => {
                        TestField.setShowable(true);
                    });
                    it('Returns correct value', () => {
                        assert.equal(TestField.toString(true), "<input type='text' name='" +
                        testParameters.name +
                        "' placeholder='" +
                        testParameters.placeholder +
                        "' value='" +
                        testParameters.value +
                        "'>");
                    });
                });
            });
        });
    });
});