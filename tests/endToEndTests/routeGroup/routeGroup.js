let { WombatServer } = require("../../../index.js"),
	logger = require("../../../src/Logger.js"),
	request = require("request");

WombatServer.withoutDatabase()
	.setUnsecure()
	.init(() => {
		let finishedTests = 0,
			finishTest = (response) => {
				logger.log(response);
				finishedTests++;
				if (finishedTests === 4){
					process.exit(0);
				}
			};
		request.post("http://localhost:" + WombatServer.getPort() + "/user/login", (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
		request.get("http://localhost:" + WombatServer.getPort() + "/user/logout", (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
		request.get("http://localhost:" + WombatServer.getPort() + "/user/admin/edit", (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
		request.delete("http://localhost:" + WombatServer.getPort() + "/user/admin/delete", (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
	});
