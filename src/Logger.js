let { Console } = require("console");

module.exports = new Console({ stdout: process.stdout, stderr: process.stderr });