require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SAND_GRID_API_KEY);

const message = {
    to: "lucas.liduvinosantos@gmail.com",
    from: "lucas.trabalho1533@gmail.com",
    subject: "Eaee canto",
    text: "Vai tudo toma no cu porra ",
};

sgMail.send(message);
