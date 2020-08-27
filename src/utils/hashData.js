const bcrypt = require("bcrypt");

module.exports = function (data) {
    return new Promise(async (resolve) => {
        const saltLevel = 10;
        const salt = await bcrypt.genSalt(saltLevel);
        const hash = await bcrypt.hash(data, salt);

        resolve(hash);
    });
};
