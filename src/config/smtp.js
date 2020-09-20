require('dotenv').config()
module.exports = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,

  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },

  tls: {
    rejectUnauthorized: false,
  },
}
