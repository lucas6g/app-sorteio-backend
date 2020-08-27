const knex = require("../database/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const sendTokenConfirmation = require("../utils/sendTokenConfirmation");
const hashData = require("../utils/hashData");
require("dotenv").config();

module.exports = {
    async signup(req, res) {
        const { user_name, email, password, push_token } = req.body;

        const user = {
            user_name,
            email,
            password,
            push_token,
            confirmation_token: generateToken(),
        };

        const userNameExists = await knex("user")
            .select("user_name")
            .where("user_name", "=", user_name);

        const emailExists = await knex("user")
            .select("email")
            .where("email", "=", email);
        if (userNameExists.length !== 0) {
            return res.status(401).json({ error: "user name already exists" });
        }
        if (emailExists.length !== 0) {
            return res.status(401).json({ error: "this email already exists" });
        }

        if (!email || !password) {
            return res
                .status(401)
                .json({ error: "Os campos email e senha são obrigatorios" });
        }

        //hash password
        user.password = await hashData(user.password);

        /*
            send token  to user email 
        */
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        user.confirmation_token_expires = now;

        const idsArray = await knex("user").insert(user).returning("user_id");
        const userId = idsArray[0];

        sendTokenConfirmation(user.email, user.confirmation_token);
        const insertedUser = await knex("user")
            .select("email")
            .where("user.user_id", "=", idsArray[0]);

        const emailInserted = insertedUser[0].email;

        const token = jwt.sign({ userId }, process.env.JWT_KEY);

        if (token) {
            return res.status(201).json({ token, emailInserted });
        }
    },

    async signin(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(422)
                .json({ erro: "you need provide email and password" });
        }
        //this select return an array
        const user = await knex("user")
            .select("*")
            .where("user.email", "=", email);

        if (!user[0]) {
            return res.status(422).json({ erro: "invalid email or password" });
        }

        if (!user[0].is_verified) {
            return res
                .status(422)
                .json({ erro: "account without verification" });
        }
        try {
            await comparePassword(password, user[0].password);
            //creating a token whit the user information
            const token = jwt.sign(
                { userId: user[0].user_id },
                process.env.JWT_KEY
            );
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(422).json({ erro: "invalid email or password" });
        }
    },

    async acountConfirmation(req, res) {
        const { email, confirmation_token } = req.body;

        if (!confirmation_token) {
            return res.status(422).json({ error: "invalid token" });
        }

        const user = await knex("user")
            .select("confirmation_token", "confirmation_token_expires")
            .where("user.email", "=", email);

        if (!user[0]) {
            return res.status(404).json({ error: "user not found" });
        }
        if (user[0].confirmation_token !== confirmation_token) {
            return res.status(422).json({ error: "invalid token" });
        }

        const now = new Date();

        if (now > user[0].confirmation_token_expires) {
            return res
                .status(400)
                .json({ error: "token expired generate new one" });
        }

        await knex("user")
            .update("is_verified", true)
            .where("user.confirmation_token", "=", confirmation_token);

        return res.status(200).json({ is_verified: true });
    },

    async reSendConfirmationToken(req, res) {
        const { email } = req.body;

        const user = await knex("user")
            .select()
            .where("user.email", "=", email);

        if (!user[0]) {
            return res.status(404).json({ error: "user not found" });
        } else {
            const token = generateToken();

            const now = new Date();
            now.setMinutes(now.getMinutes() + 5);

            await knex("user")
                .update({
                    confirmation_token: token,
                    confirmation_token_expires: now,
                })
                .where("user.email", "=", email);
            sendTokenConfirmation(email, token);
            return res.send();
        }
    },
    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await knex("user")
                .select("email")
                .where("user.email", "=", email);

            if (!user[0]) {
                return res.status(404).json({ error: "user not found" });
            } else {
                const token = generateToken();
                const now = new Date();
                now.setMinutes(now.getMinutes() + 5);
                await knex("user")
                    .update({
                        reset_password_token: token,
                        reset_password_token_expires: now,
                    })
                    .where("user.email", "=", email);
                sendTokenConfirmation(email, token);
                return res.send();
            }
        } catch (error) {
            res.status(400).json({ error: "reset password fail" });
        }
    },

    async resetPassword(req, res) {
        const { token, email, password } = req.body;

        try {
            const user = await knex("user")
                .select("reset_password_token", "reset_password_token_expires")
                .where("user.email", "=", email);

            if (!user[0]) {
                return res.status(404).json({ error: "user not found" });
            }
            if (token !== user[0].reset_password_token) {
                return res.status(400).json({ error: "invalid token" });
            }

            const now = new Date();

            if (now > user[0].confirmation_token_expires) {
                return res
                    .status(400)
                    .json({ error: "token expired generate new one" });
            }
            await knex("user")
                .update({
                    password: await hashData(password),
                })
                .where("user.email", "=", email);
            return res.status(200).json({ message: "password updated" });
        } catch (error) {
            return res
                .status(400)
                .json({ error: "canot reset password tray agoin" });
        }
    },
};
function comparePassword(candidatePassword, userPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                //not is the password
                return reject(false);
            }
            resolve(true);
        });
    });
}
