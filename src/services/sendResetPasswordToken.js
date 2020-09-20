const nodemailer = require('nodemailer')
const smtp = require('../config/smtp')
require('dotenv').config()
module.exports = async function (userEmail, token) {
  const transporter = nodemailer.createTransport(smtp)
  await transporter.sendMail({
    to: userEmail,
    from: process.env.SAND_GRID_EMAIL,
    subject: 'Token de recuperacao de conta',
    text: 'Por favor copie e cole o token no campo de inserir token',
    html: `<strong> ${token} </strong>`,
  })
}
