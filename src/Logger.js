let { Console } = require("console");

class Logger{
}

if (typeof Logger.console === "undefined"){
	Logger.console = new Console({
		stdout: process.stdout,
		stderr: process.stderr
	});
}

module.exports = Logger.console;
