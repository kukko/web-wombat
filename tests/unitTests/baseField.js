let { assert } = require('chai'),
    sinon = require('sinon');

describe('BaseField', () => {
    let BaseField;
    before(() => {
        BaseField = require('../../index.js').BaseField;
    });
    it('Can load BaseField', () => {
        assert.isFunction(BaseField);
    });
    describe('Can instantiate with parameters', () => {
        let TestField,
            testParameters = {
                name: 'testName',
                type: 'testType',
                showable: Math.random() >= 0.5,
                editable: Math.random() >= 0.5,
                required: Math.random() >= 0.5
            };
        before(() => {
            TestField = new BaseField(testParameters.name, testParameters.type, testParameters.showable, testParameters.editable, testParameters.required);
        });
        it('The \'name\' attribute have been set correctly', () => {
            assert.equal(TestField.name, testParameters.name);
        });
        it('The \'type\' attribute have been set correctly', () => {
            assert.equal(TestField.type, testParameters.type);
        });
        it('The \'showable\' attribute have been set correctly', () => {
            assert.equal(TestField.showable, testParameters.showable);
        });
        it('The \'editable\' attribute have been set correctly', () => {
            assert.equal(TestField.editable, testParameters.editable);
        });
        it('The \'required\' attribute have been set correctly', () => {
            assert.equal(TestField.required, testParameters.required);
        });
        it('The \'label\' attribute have been set correctly', () => {
            assert.isUndefined(TestField.getLabel());
        });
    });
    describe('Can set attributes through setters', () => {
        let TestField,
            defaultAttributes = {
                name: 'testName',
                type: 'testType',
                showable: Math.random() >= 0.5,
                editable: Math.random() >= 0.5,
                required: Math.random() >= 0.5
            },
            newAttributes = {
                name: defaultAttributes.name.split('').reverse().join(''),
                type: defaultAttributes.type.split('').reverse().join(''),
                showable: !defaultAttributes.showable,
                editable: !defaultAttributes.editable,
                required: !defaultAttributes.required,
                label: 'testLabel',
                value: 'testValue'
            };
        before(() => {
            TestField = new BaseField(defaultAttributes.name, defaultAttributes.type);
            TestField.setName(newAttributes.name);
            TestField.setType(newAttributes.type);
            TestField.setShowable(newAttributes.showable);
            TestField.setEditable(newAttributes.editable);
            TestField.setRequired(newAttributes.required);
            TestField.setLabel(newAttributes.label);
            TestField.setValue(newAttributes.value);
        });
        it('name', () => {
            assert.equal(TestField.name, newAttributes.name);
        });
        it('type', () => {
            assert.equal(TestField.type, newAttributes.type);
        });
        it('label', () => {
            assert.equal(TestField.label, newAttributes.label);
        });
        describe('showable', () => {
            describe('Can set to false', () => {
                before(() => {
                    TestField.setShowable(false);
                });
                it('Attribute have been set', () => {
                    assert.equal(TestField.showable, false);
                });
            });
            describe('Can set to true', () => {
                before(() => {
                    TestField.setShowable(true);
                });
                it('Attribute have been set', () => {
                    assert.equal(TestField.showable, true);
                });
            });
        });
        describe('editable', () => {
            describe('Can set to false', () => {
                before(() => {
                    TestField.setEditable(false);
                });
                it('Attribute have been set', () => {
                    assert.equal(TestField.editable, false);
                });
            });
            describe('Can set to true', () => {
                before(() => {
                    TestField.setEditable(true);
                });
                it('Attribute have been set', () => {
                    assert.equal(TestField.editable, true);
                });
            });
        });
        describe('required', () => {
            describe('Can set to false', () => {
                before(() => {
                    TestField.setRequired(false);
                });
                it('Attribute have been set', () => {
                    assert.equal(TestField.required, false);
                });
            });
            describe('Can set to true', () => {
                before(() => {
                    TestField.setRequired(true);
                });
                it('Attribute have been set', () => {
                    assert.equal(TestField.required, true);
                });
            });
        });
    });
    describe('Methods works as expected', () => {
        let TestField,
            testParameters = {
                name: 'testName',
                type: 'string',
                showable: Math.random() >= 0.5,
                editable: Math.random() >= 0.5,
                required: Math.random() >= 0.5,
                value: 'testValue'
            };
        before(() => {
            TestField = new BaseField(testParameters.name, testParameters.type, testParameters.showable, testParameters.editable, testParameters.required);
            TestField.setValue(testParameters.value);
        });
        it('The getter for \'label\' attribute returns \'name\' attribute if \'label\' have not been set', () => {
            assert.equal(TestField.label, testParameters.name);
        });
        describe('The toString method work correctly', () => {
            before(() => {
                TestField.setValue(testParameters.value);
            });
            describe('The \'showable\' attribute is false', () => {
                before(() => {
                    TestField.setShowable(false);
                });
                it('Returns correct value', () => {
                    assert.equal(TestField.toString(), testParameters.name + ": " + undefined);
                });
            });
            describe('The \'showable\' attribute is true', () => {
                before(() => {
                    TestField.setShowable(true);
                });
                it('Returns correct value', () => {
                    assert.equal(TestField.toString(), testParameters.name + ": " + testParameters.value);
                });
            });
        });
        describe('Getter for \'value\' attribute', () => {
            describe('Showable is false', () => {
                before(() => {
                    TestField.setShowable(false);
                });
                it('Returns undefined', () => {
                    assert.isUndefined(TestField.value);
                });
            });
            describe('Showable is true', () => {
                before(() => {
                    TestField.setShowable(true);
                });
                describe('Value wasn\'t set', () => {
                    before(() => {
                        TestField.setValue();
                    });
                    it('Returns empty string', () => {
                        assert.isEmpty(TestField.value);
                    });
                });
                describe('Value have been set', () => {
                    before(() => {
                        TestField.setValue(testParameters.value);
                    });
                    it('Returns empty string', () => {
                        assert.equal(TestField.value, testParameters.value);
                    });
                });
            });
        });
        describe('The \'validate\' method works correctly', () => {
            describe('Wrong value type', () => {
                before(() => {
                    TestField.setValue(Math.random());
                    TestField.setRequired(false);
                });
                it('Returns false', () => {
                    assert.isFalse(TestField.validate());
                });
            });
            describe('Required', () => {
                before(() => {
                    TestField.setRequired(true);
                });
                describe('Undefined value', () => {
                    before(() => {
                        TestField.setValue();
                    });
                    it('Returns false', () => {
                        assert.isFalse(TestField.validate());
                    });
                });
                describe('Empty value', () => {
                    before(() => {
                        TestField.setValue("");
                    });
                    it('Returns false', () => {
                        assert.isFalse(TestField.validate());
                    });
                });
                describe('Correct value', () => {
                    before(() => {
                        TestField.setValue("foo");
                    });
                    it('Returns true', () => {
                        assert.isTrue(TestField.validate());
                    });
                });
            });
        });
    });
});