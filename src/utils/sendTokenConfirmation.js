const sgMail = require("@sendgrid/mail");
require("dotenv").config();
module.exports = async function (email, token) {
    sgMail.setApiKey(process.env.SAND_GRID_API_KEY);
    const msg = {
        to: email,
        from: process.env.SAND_GRID_EMAIL,
        subject: "Comfirmação da conta",
        text: `Seu codigo de confirmação é `,
        html: `<strong> ${token} </strong>`,
    };
    await sgMail.send(msg);
};
