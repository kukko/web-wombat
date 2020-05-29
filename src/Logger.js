let { Console } = require("console");

class Logger{
}

Logger.console = new Console({
	stdout: process.stdout,
	stderr: process.stderr
});

module.exports = Logger.console;
