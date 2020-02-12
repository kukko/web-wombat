let { WombatServer } = require("../../../index.js"),
	request = require("request");

let completedTests = 0,
	finishTest = () => {
		completedTests++;
		if (completedTests === 1){
			process.exit(0);
		}
	};

WombatServer.withoutDatabase().setUnsecure().init(() => {
    let FormData = require('form-data'),
        form = new FormData(),
        fs = require('fs'),
        path = require('path');
    form.append('uploaded_file', fs.createReadStream(path.resolve(__dirname, './assets/logo.jpg')));
    form.submit('http://localhost:'+WombatServer.getPort()+'/', (error, response) => {
        if (!error){
            process.exit();
        }
        else{
            process.exit(1);
        }
    });
});