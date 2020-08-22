const jwt = require("jsonwebtoken");
const knex = require("../database/connection");

//midleware que serve para dar acesso as rotas da minha aplicacao
//aos usurios que tiverem token

module.exports = function (req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "voce deve estar authenticado" });
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, "MY_SECRET_KEY", async function (error, payload) {
        if (error) {
            return res.status(401).json({ error: "You mos be login" });
        }
        //obejeto payload armazena a informacao que o jwt esta criptografando
        const { userId } = payload;

        const user = await knex("user")
            .select("*")
            .where("user.user_id", "=", userId);

        req.user = user[0];
        next();
    });
};
