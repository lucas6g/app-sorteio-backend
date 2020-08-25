const knex = require("../database/connection");

class UserModel {
    constructor(userName, email, password, pushToken) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.pushToken = pushToken;
        this.confirmationToken = Math.floor(100000 + Math.random() * 900000);
    }

    async store() {
        await knex("user").insert(this);
    }

    async findOne(userData, where) {
        const user = await knex("user").select("*").where(where, "=", userData);
        return user[0] ? true : false;
    }
}

module.exports = UserModel;
