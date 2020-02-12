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
		request.post("http://localhost:" + WombatServer.getPort() + "/user/login",
		{
			headers: {
				"content-type": "text/html"
			}
		}, (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
		request.get("http://localhost:" + WombatServer.getPort() + "/user/logout",
		{
			headers: {
				"content-type": "text/html"
			}
		}, (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
		request.get("http://localhost:" + WombatServer.getPort() + "/user/admin/edit",
		{
			headers: {
				"content-type": "text/html"
			}
		}, (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
		request.delete("http://localhost:" + WombatServer.getPort() + "/user/admin/delete",
		{
			headers: {
				"content-type": "text/html"
			}
		}, (error, response, body) => {
			if (!error){
				finishTest(body);
			}
			else{
				logger.log(error);
				process.exit(1);
			}
		});
	});
