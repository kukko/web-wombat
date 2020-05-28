let assert = require('chai').assert,
    sinon = require('sinon');

describe('BaseDocument', () => {
    let BaseDocument;
    before(() => {
        BaseDocument = require('../../index.js').BaseDocument;
    });
    it('Can be loaded', () => {
        assert.isFunction(BaseDocument);
    });
    describe('Have basic documented methods', () => {
        it('getStructure', () => {
            assert.isFunction(BaseDocument.getStructure);
        });
        it('createStructure', () => {
            assert.isFunction(BaseDocument.createStructure);
        });
        it('buildStructure', () => {
            assert.isFunction(BaseDocument.buildStructure);
        });
        it('addField', () => {
            assert.isFunction(BaseDocument.addField);
        });
        it('getFieldByName', () => {
            assert.isFunction(BaseDocument.getFieldByName);
        });
        it('validateDocument', () => {
            assert.isFunction(BaseDocument.validateDocument);
        });
    });
    describe('Attributes have correct basic values', () => {
        it('structure', () => {
            assert.isUndefined(BaseDocument.structure);
        });
    });
    describe('Methods works as expected', () => {
        let FakeDocumentClass;
        beforeEach(() => {
            class FakeDocument extends BaseDocument {
            }
            FakeDocumentClass = FakeDocument;
        });
        describe('getStructure', () => {
            let previousStructure;
            beforeEach(() => {
                previousStructure = FakeDocumentClass.structure;
            });
            describe('The \'values\' parameter is \'undefined\'', () => {
                describe('Call createStructure when needed', () => {
                    describe('The \'createStructure\' method was not called before', () => {
                        beforeEach(() => {
                            sinon.spy(FakeDocumentClass, 'createStructure');
                            FakeDocumentClass.getStructure();
                        });
                        it('The \'createStructure\' method was called once', () => {
                            sinon.assert.calledOnce(FakeDocumentClass.createStructure);
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    describe('The \'createStructure\' method was called before', () => {
                        beforeEach(() => {
                            FakeDocumentClass.createStructure();
                            sinon.spy(FakeDocumentClass, 'createStructure');
                            FakeDocumentClass.getStructure();
                        });
                        it('The \'createStructure\' method was not called', () => {
                            sinon.assert.notCalled(FakeDocumentClass.createStructure);
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                });
                describe('Returns correct value', () => {
                    it('Returns array', () => {
                        assert.isArray(FakeDocumentClass.getStructure());
                    });
                    it('Returns \'structure\' attribute document', () => {
                        assert.equal(FakeDocumentClass.getStructure(), FakeDocumentClass.structure);
                    });
                });
            });
            describe('The \'values\' parameter is an object', () => {
                let values;
                beforeEach(() => {
                    values = {};
                });
                describe('Call createStructure when needed', () => {
                    describe('The \'createStructure\' method was not called before', () => {
                        beforeEach(() => {
                            sinon.spy(FakeDocumentClass, 'createStructure');
                            FakeDocumentClass.getStructure(values);
                        });
                        it('The \'createStructure\' method was called once', () => {
                            sinon.assert.calledOnce(FakeDocumentClass.createStructure);
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                    describe('The \'createStructure\' method was called before', () => {
                        beforeEach(() => {
                            FakeDocumentClass.createStructure();
                            sinon.spy(FakeDocumentClass, 'createStructure');
                            FakeDocumentClass.getStructure(values);
                        });
                        it('The \'createStructure\' method was not called', () => {
                            sinon.assert.notCalled(FakeDocumentClass.createStructure);
                        });
                        afterEach(() => {
                            sinon.restore();
                        });
                    });
                });
                describe('Returns correct value', () => {
                    let validField,
                        validFieldName,
                        testValue;
                    beforeEach(() => {
                        validFieldName = 'ValidField';
                        validField = {
                            name: validFieldName,
                            setValue: sinon.fake(function (value) {
                                this.value = value;
                            })
                        };
                        testValue = "Foo";
                        values[validFieldName] = testValue;
                        FakeDocumentClass.addField(validField);
                    });
                    it('Returns array', () => {
                        assert.isArray(FakeDocumentClass.getStructure(values));
                    });
                    it('Returns \'structure\' attribute document', () => {
                        let expectedValue = FakeDocumentClass.structure;
                        expectedValue[0].value = testValue;
                        assert.deepEqual(FakeDocumentClass.getStructure(values), expectedValue);
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('Calls \'setValue\' method of field', () => {
                    let validField,
                        validFieldName,
                        testValue;
                    beforeEach(() => {
                        validFieldName = 'ValidField';
                        validField = {
                            name: validFieldName,
                            setValue: sinon.fake(function (value) {
                                this.value = value;
                            })
                        };
                        testValue = "Foo";
                        values[validFieldName] = testValue;
                        FakeDocumentClass.addField(validField);
                        FakeDocumentClass.getStructure(values);
                    });
                    it('Called as many times as many field\'s value is presented in the \'values\' parameter', () => {
                        sinon.assert.calledOnce(validField.setValue);
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('It is not modifying fields in structure', () => {
                    let validField,
                        validFieldName,
                        testValue;
                    beforeEach(() => {
                        validFieldName = 'ValidField';
                        validField = {
                            name: validFieldName,
                            setValue: sinon.fake(function (value) {
                                this.value = value;
                            })
                        };
                        testValue = "Foo";
                        values[validFieldName] = testValue;
                        FakeDocumentClass.addField(validField);
                        FakeDocumentClass.getStructure(values);
                    });
                    it('Returns fields with filled values', () => {
                        assert.doesNotHaveAnyKeys(FakeDocumentClass.structure[0], ['value']);
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('The \'values\' parameter contains values only for existing fields', () => {
                    let validField,
                        validFieldName,
                        testValue,
                        expectedValue;
                    beforeEach(() => {
                        validFieldName = 'ValidField';
                        validField = {
                            name: validFieldName,
                            setValue: sinon.fake(function (value) {
                                this.value = value;
                            })
                        };
                        testValue = "Foo";
                        values[validFieldName] = testValue;
                        FakeDocumentClass.addField(validField),
                        expectedValue = [];
                        for (let i in FakeDocumentClass.structure){
                            expectedValue.push({
                                ...FakeDocumentClass.structure[i],
                                value: testValue
                            });
                        }
                    });
                    it('Returns fields with filled values', () => {
                        assert.deepEqual(FakeDocumentClass.getStructure(values), expectedValue);
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
                describe('The \'values\' parameter contains values for nonexistent fields', () => {
                    let validField,
                        validFieldName,
                        nonexistentFieldName,
                        testValue,
                        expectedValue;
                    beforeEach(() => {
                        validFieldName = 'ValidField';
                        nonexistentFieldName = 'NonexistentFieldName';
                        validField = {
                            name: validFieldName
                        };
                        testValue = "Foo";
                        values[nonexistentFieldName] = testValue;
                        FakeDocumentClass.addField(validField);
                        expectedValue = [];
                        for (let i in FakeDocumentClass.structure){
                            expectedValue.push({
                                ...FakeDocumentClass.structure[i]
                            });
                        }
                    });
                    it('Returns fields with filled values', () => {
                        assert.deepEqual(FakeDocumentClass.getStructure(values), expectedValue);
                    });
                    afterEach(() => {
                        sinon.restore();
                    });
                });
            });
            afterEach(() => {
                FakeDocumentClass.structure = previousStructure;
            });
        });
        describe('createStructure', () => {
            describe('Have been called when needed', () => {
                beforeEach(() => {
                    FakeDocumentClass.createStructure = sinon.spy();
                });
                it('When \'getStructure\' method called', () => {
                    FakeDocumentClass.getStructure();
                    sinon.assert.calledOnce(FakeDocumentClass.createStructure);
                });
                afterEach(() => {
                    sinon.restore();
                });
            });
            describe('Returns correct value', () => {
                let previousStructure;
                before(() => {
                    previousStructure = BaseDocument.structure;
                });
                it('Returns \'undefined\'', () => {
                    assert.isUndefined(BaseDocument.createStructure());
                });
                after(() => {
                    BaseDocument.structure = previousStructure;
                });
            });
            describe('Modify attributes correctly', () => {
                let previousStructure;
                before(() => {
                    previousStructure = BaseDocument.structure;
                    BaseDocument.createStructure();
                });
                it('The \'structure\' attribute contains array', () => {
                    assert.isArray(BaseDocument.structure);
                });
                it('The \'structure\' attribute is empty', () => {
                    assert.isEmpty(BaseDocument.structure);
                });
                after(() => {
                    BaseDocument.structure = previousStructure;
                });
            });
        });
        describe('buildStructure', () => {
            beforeEach(() => {
                FakeDocumentClass.buildStructure = sinon.spy();
            });
            describe('Returns correct value', () => {
                it('Returns \'undefined\'', () => {
                    assert.isUndefined(BaseDocument.buildStructure());
                });
            });
            describe('Have been called when needed', () => {
                it('When \'createStructure\' method called', () => {
                    FakeDocumentClass.createStructure();
                    sinon.assert.calledOnce(FakeDocumentClass.buildStructure);
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('addField', () => {
            beforeEach(() => {
                sinon.spy(FakeDocumentClass, "createStructure");
            });
            it('If have been called before \'createStructure\' method, it calls that.', () => {
                FakeDocumentClass.addField({});
                sinon.assert.calledOnce(FakeDocumentClass.createStructure);
            });
            describe('Adds element to the structure', () => {
                let previousStructure,
                    testField = {
                        name: 'TestField',
                        type: 'text'
                    };
                beforeEach(() => {
                    previousStructure = BaseDocument.structure;
                });
                describe('The \'createStructure\' was not called before', () => {
                    beforeEach(() => {
                        FakeDocumentClass.addField(testField);
                    });
                    it('The \'structure\' attribute is array', () => {
                        assert.isArray(FakeDocumentClass.structure);
                    });
                    it('The length of \'structure\' attribute is 1', () => {
                        assert.lengthOf(FakeDocumentClass.structure, 1);
                    });
                    it('The first element of \'structure\' attribute is equal with added field', () => {
                        assert.equal(FakeDocumentClass.structure[0], testField);
                    });
                });
                describe('The \'createStructure\' was called before', () => {
                    beforeEach(() => {
                        FakeDocumentClass.createStructure();
                        FakeDocumentClass.addField(testField);
                    });
                    it('The \'structure\' attribute is array', () => {
                        assert.isArray(FakeDocumentClass.structure);
                    });
                    it('The length of \'structure\' attribute is 1', () => {
                        assert.lengthOf(FakeDocumentClass.structure, 1);
                    });
                    it('The first element of \'structure\' attribute is equal with added field', () => {
                        assert.equal(FakeDocumentClass.structure[0], testField);
                    });
                });
                afterEach(() => {
                    BaseDocument.structure = previousStructure;
                });
            });
            describe('Returns correct value', () => {
                it('Returns the document itself.', () => {
                    assert.equal(FakeDocumentClass.addField({}), FakeDocumentClass);
                });
            });
            afterEach(() => {
                sinon.restore();
            });
        });
        describe('getFieldByName', () => {
            let previousStructure;
            beforeEach(() => {
                previousStructure = FakeDocumentClass.structure;
            });
            describe('The \'fields\' parameter is undefined', () => {
                let existingField,
                    existingFieldName;
                beforeEach(() => {
                    existingFieldName = 'ExistingField';
                    existingField = {
                        name: existingFieldName
                    };
                    FakeDocumentClass.addField(existingField);
                });
                it('Returns field from structure if field exists with name passed name', () => {
                    assert.equal(FakeDocumentClass.getFieldByName(existingFieldName), existingField);
                });
                it('Returns \'undefined\' if field with name passed not exists in the structure', () => {
                    assert.isUndefined(FakeDocumentClass.getFieldByName('NonexistentFieldName'));
                });
            });
            describe('The \'fields\' parameter have been set', () => {
                let existingField,
                    existingFieldName,
                    fields;
                beforeEach(() => {
                    existingFieldName = 'ExistingField';
                    existingField = {
                        name: existingFieldName
                    };
                    fields = [
                        existingField
                    ];
                });
                it('Returns field from structure if field exists with name passed name', () => {
                    assert.equal(FakeDocumentClass.getFieldByName(existingFieldName, fields), existingField);
                });
                it('Returns \'undefined\' if field with name passed not exists in the structure', () => {
                    assert.isUndefined(FakeDocumentClass.getFieldByName('NonexistentFieldName', fields));
                });
            });
            afterEach(() => {
                FakeDocumentClass.structure = previousStructure;
            });
        });
        describe('validateDocument', () => {
            let previousStructure;
            beforeEach(() => {
                previousStructure = FakeDocumentClass.structure;
            });
            describe('Valid document', () => {
                let values,
                    validFieldName;
                beforeEach(() => {
                    validFieldName = 'ValidField';
                    values = [];
                    values[validFieldName] = 'firstField'
                    FakeDocumentClass.addField({
                        name: validFieldName,
                        setValue: sinon.spy(),
                        validate: () => {
                            return true;
                        }
                    });
                });
                it('Returns true', () => {
                    assert.isTrue(FakeDocumentClass.validateDocument(values));
                });
            });
            describe('Invalid document', () => {
                let values,
                    validFieldName;
                beforeEach(() => {
                    validFieldName = 'ValidField';
                    values = [];
                    values[validFieldName] = 'firstField'
                    FakeDocumentClass.addField({
                        name: validFieldName,
                        setValue: sinon.spy(),
                        validate: () => {
                            return false;
                        }
                    });
                });
                it('Returns false', () => {
                    assert.isFalse(FakeDocumentClass.validateDocument(values));
                });
            });
            afterEach(() => {
                FakeDocumentClass.structure = previousStructure;
            });
        });
    });
});