let StepInterface = require('../StepInterface'),
	{ join } = require('path');

class AddWebWombatAsDependency extends StepInterface{
	run(appName){
		require('child_process').execSync('npm install web-wombat --save', {
			cwd: join(process.cwd(), appName),
			stdio: [
				process.stdin,
				process.stdout,
				process.stderr
			]
		});
	}
}

module.exports = AddWebWombatAsDependency;