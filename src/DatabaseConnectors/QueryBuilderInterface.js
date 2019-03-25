class QueryBuilderInterface {
	from(collectionName) {
		throw new Error(
			"You must implement the `from` method in your QueryBuilder."
		);
	}
	where(condition) {
		throw new Error(
			"You must implement the `where` method in your QueryBuilder."
		);
	}
	getWhere() {
		throw new Error(
			"You must implement the `getWhere` method in your QueryBuilder."
		);
	}
	insert(collectionName, toBeInserted) {
		throw new Error(
			"You must implement the `insert` method in your QueryBuilder."
		);
	}
}

module.exports = QueryBuilderInterface;
