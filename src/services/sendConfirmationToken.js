const nodemailer = require('nodemailer')
const smtp = require('../config/smtp')
require('dotenv').config()
module.exports = async function (userEmail, token) {
  const transporter = nodemailer.createTransport(smtp)

  const response = await transporter.sendMail({
    to: userEmail,
    from: `Dream Draw ${process.env.SMTP_EMAIL}`,
    subject: 'Comfirmação da conta',
    html: `
    Seu codigo de confirmação é 
    <strong> ${token} </strong>
    
    `,
  })

  console.log(response)
}
