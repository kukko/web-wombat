let { WombatServer } = require("../../index.js"),
	MongoDBConnector = require("../../src/DatabaseConnectors/MongoDBConnector/MongoDBConnector.js"),
	request = require("request");

function makeRequest(path, method = "GET", data = {}) {
	return new Promise((resolve, reject) => {
		request(
			{
				url: "http://localhost:" + WombatServer.getPort() + path,
				method,
				form: data,
				followAllRedirects: true
			},
			(error, storeResponse, body) => {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			}
		);
	});
}

WombatServer.setUnsecure()
	.setDatabaseConnector(MongoDBConnector)
	.init((port) => {
		makeRequest("/insertOne", "POST", {
			foo: "bar"
		}).then((insertResponse) => {
			makeRequest("/findById/" + insertResponse).then(
				(findByIdResponse) => {
					findByIdResponse = JSON.parse(findByIdResponse);
					makeRequest("/findAllWithAttribute", "POST", {
						foo: "bar"
					}).then((findAllWithAttributeResponse) => {
						findAllWithAttributeResponse = JSON.parse(
							findAllWithAttributeResponse
						);
						let completedUpdated = 0,
							updateCompleted = () => {
								completedUpdated++;
								if (
									completedUpdated >=
									findAllWithAttributeResponse.length
								) {
									makeRequest(
										"/findAllWithAttribute",
										"POST",
										{
											foo: "example"
										}
									).then(
										(
											findAllWithUpdatedAttributeResponse
										) => {
											findAllWithUpdatedAttributeResponse = JSON.parse(
												findAllWithUpdatedAttributeResponse
											);
											let completedDelete = 0,
												deleteCompleted = () => {
													completedDelete++;
													if (
														completedDelete >=
														findAllWithUpdatedAttributeResponse.length
													) {
														process.exit();
													}
												};
											findAllWithUpdatedAttributeResponse.forEach(
												(item, index) => {
													makeRequest(
														"/deleteById/" +
															item._id,
														"DELETE"
													).then(
														(
															deleteByIdResponse
														) => {
															deleteCompleted();
														}
													);
												}
											);
										}
									);
								}
							};
						findAllWithAttributeResponse.forEach((item, index) => {
							makeRequest("/updateById/" + item._id, "POST", {
								foo: "example"
							}).then((updateByIdResponse) => {
								updateCompleted();
							});
						});
					});
				}
			);
		});
	});
