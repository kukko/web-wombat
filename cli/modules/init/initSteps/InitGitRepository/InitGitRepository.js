let StepInterface = require('../StepInterface'),
	{ join } = require('path');

class InitGitRepository extends StepInterface{
	run(next, appName){
		require('child_process').execSync('git init', {
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

module.exports = InitGitRepository;