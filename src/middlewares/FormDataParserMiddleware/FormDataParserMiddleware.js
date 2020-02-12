let BaseMiddleware = require("../BaseMiddleware.js"),
    formidable = require("formidable");

class FormDataParserMiddleware extends BaseMiddleware {
	static run(request, response, next) {
        let requestBody = "",
            isMultipart = typeof request.headers['content-type'] !== "undefined" && request.headers['content-type'].indexOf('multipart/form-data;') !== -1,
            completed = 0,
            callNext = () => {
                completed++;
                if (completed == (isMultipart ? 2 : 1)){
                    next();
                }
            };
        request.on("data", (chunk) => {
            requestBody += chunk.toString();
        });
        request.on("end", () => {
            request.rawBody = requestBody;
            callNext();
        });
		if (["POST", "PUT", "UPDATE"].indexOf(request.method) !== -1 && isMultipart) {
            let form = formidable();
            form.parse(request, (error, fields, files) => {
                request.body = fields;
                request.files = files;
                callNext();
            });
        }
	}
}

module.exports = FormDataParserMiddleware;
