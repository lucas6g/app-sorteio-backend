const crypto = require("crypto");

module.exports = function () {
    const token = crypto.randomBytes(20).toString("hex");
    return token;
};
