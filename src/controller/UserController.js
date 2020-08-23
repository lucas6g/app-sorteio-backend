const knex = require("../database/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SAND_GRID_API_KEY);

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

async function sendTokenConfirmationAcount(email, token) {
    sgMail.setApiKey(process.env.SAND_GRID_API_KEY);
    const msg = {
        to: email,
        from: process.env.SAND_GRID_EMAIL,
        subject: "Comfirmação da conta",
        text: `Seu codigo de confirmação é `,
        html: `<strong> ${token} </strong>`,
    };
    await sgMail.send(msg);
}

module.exports = {
    async signup(req, res) {
        const { user_name, email, password, push_token } = req.body;

        const user = {
            user_name,
            email,
            password,
            push_token,
            confirmation_token: Math.floor(100000 + Math.random() * 900000),
        };

        const userNameExists = await knex("user")
            .select("*")
            .where("user_name", "=", user_name);

        const emailExists = await knex("user")
            .select("*")
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
        const saltLevel = 10;
        const salt = await bcrypt.genSalt(saltLevel);
        const hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword;
        /*
            send token  to user email 
        */

        const idsArray = await knex("user").insert(user).returning("user_id");

        sendTokenConfirmationAcount(user.email, user.confirmation_token);

        const userId = idsArray[0];
        const token = jwt.sign({ userId }, process.env.JWT_KEY);

        if (token) {
            return res.status(201).json({ token });
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
        const { confirmation_token } = req.body;

        if (!confirmation_token) {
            return res.status(422).json({ error: "invalid token" });
        }

        const user = await knex("user")
            .select("*")
            .where("user.confirmation_token", "=", confirmation_token);

        if (user[0]) {
            await knex("user")
                .update("is_verified", true)
                .where("user.confirmation_token", "=", confirmation_token);
        }

        return res.status(200).json({ is_verified: true });
    },
};
