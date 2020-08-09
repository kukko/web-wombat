let StepInterface = require('../StepInterface'),
	{ join } = require('path');

class AddWebWombatAsDependency extends StepInterface{
	run(next, appName){
		require('child_process').execSync('npm install web-wombat --save', {
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

module.exports = AddWebWombatAsDependency;