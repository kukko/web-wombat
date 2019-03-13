let { lstatSync, readdirSync } = require('fs'),
	{ join, dirname, resolve } = require('path'),
	{ spawnSync } = require('child_process'),
	testsFolder = dirname(__filename),
	ignoredTests =
		typeof process.env.TRAVIS === 'undefined'
			? []
			: ['resourceController', 'secureConnection', 'webSocket'],
	tests = readdirSync(resolve(testsFolder, './')).filter((test) => {
		return (
			lstatSync(resolve(testsFolder, join('./', test))).isDirectory() &&
			ignoredTests.indexOf(test) === -1
		);
	}),
	successfulTests = 0,
	readline = require('readline'),
	printTestResult = (testName, testResult) => {
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0, null);
		let successful =
				testResult.status === 0 && testResult.stderr.length === 0,
			resultSymbol = successful ? '✓' : '✗',
			outputColor = successful ? '\x1b[32m' : '\x1b[31m';
		console.log(outputColor + testName + ' [' + resultSymbol + ']\x1b[0m');
		if (!successful) {
			console.log(testResult.stdout.toString('utf8'));
			console.log(testResult.stderr.toString('utf8'));
		}
		successfulTests += successful ? 1 : 0;
	};

for (let testIndex in tests) {
	let test = tests[testIndex];
	process.stdout.write(test + ' ...');
	let testResult = spawnSync('node', [
		resolve(testsFolder, join(test, test + '.js'))
	]);
	printTestResult(test, testResult);
}

let resultColor, exitCode;
if (successfulTests === tests.length) {
	resultColor = '\x1b[32m';
	exitCode = 0;
} else if (successfulTests > 0) {
	resultColor = '\x1b[33m';
	exitCode = 1;
} else {
	resultColor = '\x1b[31m';
	exitCode = 1;
}
console.log(
	resultColor +
		'Test results: ' +
		successfulTests +
		' / ' +
		tests.length +
		'\x1b[0m'
);

if (__filename == require.main.filename) {
	process.exit(exitCode);
} else {
	module.exports = exitCode;
}
