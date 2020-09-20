const express = require('express')
const User = require('./models/User')
const router = express.Router()

const requireAuth = require('./middlewares/requireAuth')

//rota de teste do token quando o user tem o token
router.get('/token', requireAuth, (req, res) => {
  return res.status(200).json({ email: req.user.email })
})

//teste do model

router.post('/user', async (req, res) => {
  const {
    user_name,
    email,
    password,
    whatsapp,
    img_profile,
    confirmation_token,

    reset_password_token,
  } = req.body

  const now = new Date()
  try {
    const user = {
      user_name,
      email,
      password,
      whatsapp,
      img_profile,
      confirmation_token,

      reset_password_token,
      confirmation_token_expires: now,
    }
    const userCreated = await User.create(user)

    return res.status(201).json(userCreated)
  } catch (error) {
    console.log(error)
  }
})

router.get('/user', async (req, res) => {
  const user = await User.findAll({
    attributes: ['email', 'user_name'],
  })
  return res.status(200).json(user)
})

module.exports = router
