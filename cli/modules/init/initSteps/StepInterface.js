class StepInterface{
    run(){
		throw new Error(
			"Not implemented 'run' method in class: " +
				this.constructor.name +
				"!"
		);
	}
}

module.exports = StepInterface;