let { WombatServer } = require("../../../index.js"),
	cheerio = require("cheerio"),
	http = require("http"),
	queryString = require("querystring"),
	request = require("request");

function makeRequest(path, method = "GET", data = {}) {
	return new Promise((resolve, reject) => {
		request(
			{
				url: "http://localhost:" + WombatServer.getPort() + path,
				method,
				form: data,
				followAllRedirects: true,
				headers: {
					"content-type": "text/html"
				}
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

WombatServer.setUnsecure().init((port) => {
	makeRequest("/test").then((indexResponse) => {
		let indexDocument = cheerio.load(indexResponse);
		if (indexDocument("tbody tr").length !== 0) {
			throw new Error("Table's body is not empty at the first request.");
		}
		makeRequest(indexDocument("tfoot a").attr("href")).then(
			(createResponse) => {
				let createDocument = cheerio.load(createResponse),
					data = {},
					name = "foo",
					fieldName = createDocument("input").attr("name");
				data[fieldName] = name;
				makeRequest(
					createDocument("form").attr("action"),
					"POST",
					data
				).then((storeResponse) => {
					if (storeResponse.indexOf(": " + name) === -1) {
						throw new Error(
							"After resource creation, the response didn't contained the value of the 'name' variable."
						);
					}
					makeRequest("/test").then((filledIndexResponse) => {
						let filledIndexDocument = cheerio.load(
							filledIndexResponse
						);
						if (filledIndexDocument("tbody tr").length !== 1) {
							throw new Error(
								"Table's body is empty after document creation."
							);
						}
						let editLink = filledIndexDocument(
							"tbody tr td:nth-of-type(3) a:nth-of-type(2)"
						);
						if (editLink.text() !== "Edit") {
							throw new Error(
								"The second link in the document's row is not the edit link."
							);
						}
						makeRequest(editLink.attr("href")).then(
							(editResponse) => {
								let editDocument = cheerio.load(editResponse);
								name = "bar";
								data[fieldName] = name;
								makeRequest(
									editDocument("form").attr("action"),
									"PUT",
									data
								).then((updateResponse) => {
									let updateDocument = cheerio.load(
										updateResponse
									);
									if (
										updateDocument("tbody tr").length !== 1
									) {
										throw new Error(
											"Table's body is empty after document update."
										);
									}
									if (
										updateDocument(
											"tbody tr:nth-of-type(1) td:nth-of-type(2)"
										).text() !== name
									) {
										throw new Error(
											"Document's name wasn't updated."
										);
									}
									let deleteForm = updateDocument(
											"tbody tr td:nth-of-type(3) form"
										),
										deleteButton = updateDocument(
											"tbody tr td:nth-of-type(3) form button"
										);
									if (deleteButton.text() !== "Delete") {
										throw new Error(
											"The form's submit button's text is not correct."
										);
									}
									makeRequest(
										deleteForm.attr("action"),
										"DELETE"
									).then((deleteResponse) => {
										let deleteDocument = cheerio.load(
											deleteResponse
										);
										if (
											deleteDocument("tbody tr")
												.length !== 0
										) {
											throw new Error(
												"Table's body is not empty after delete request."
											);
										}
										process.exit();
									});
								});
							}
						);
					});
				});
			}
		);
	});
});
