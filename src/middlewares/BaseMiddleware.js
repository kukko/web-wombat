class BaseMiddleware {
	static run(request, response, next) {
		throw new Error(
			"Not implemented 'run' method in class: " + this.name + '!'
		);
	}
}

module.exports = BaseMiddleware;
