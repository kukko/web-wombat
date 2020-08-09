let StepInterface = require('../StepInterface'),
	{ join } = require('path');

class GitCommit extends StepInterface{
	run(next, commitMessage, appName){
		require('child_process').execSync('git stage .', {
			cwd: join(process.cwd(), appName),
			stdio: [
				process.stdin,
				null,
				process.stderr
			]
		});
		require('child_process').execSync('git commit -m "' + commitMessage + '"', {
			cwd: join(process.cwd(), appName),
			stdio: [
				process.stdin,
				null,
				process.stderr
			]
		});
		next();
	}
}

module.exports = GitCommit;