let assert = require('chai').assert,
    sinon = require('sinon');

describe('CollectionsProvider', () => {
    let CollectionsProvider;
    beforeEach(() => {
        CollectionsProvider = require('../../index.js').CollectionsProvider;
    });
    it('Can be loaded', () => {
        assert.isFunction(CollectionsProvider);
    });
	describe('Have basic documented static 0methods', () => {
		it('getCollectionsPath', () => {
			assert.isFunction(CollectionsProvider.getCollectionsPath);
		});
		it('loadCollection', () => {
			assert.isFunction(CollectionsProvider.loadCollection);
		});
		it('getCollection', () => {
			assert.isFunction(CollectionsProvider.getCollection);
		});
		it('isDirectory', () => {
			assert.isFunction(CollectionsProvider.isDirectory);
		});
		it('getDirectories', () => {
			assert.isFunction(CollectionsProvider.getDirectories);
		});
    });
    describe('Methods works as expected', () => {
        describe('getCollectionsPath', () => {
            describe('Returns correct value', () => {
                it('Returns string', () => {
                    assert.isString(CollectionsProvider.getCollectionsPath());
                });
            });
        });
    });
});