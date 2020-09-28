const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken')
const sendConfirmationToken = require('../services/sendConfirmationToken')
const generateTokenResetPassword = require('../utils/generateTokenResetPassword')
const sendResetPasswordToken = require('../services/sendResetPasswordToken')
const hashData = require('../utils/hashData')
require('dotenv').config()

module.exports = {
  async signup(req, res) {
    const { user_name, email, password, confirm_password } = req.body

    if (!email || !password || !user_name)
      return res
        .status(401)
        .json({ error: 'The email and password fields are mandatory' })

    if (password !== confirm_password)
      return res.status(400).json({ error: 'invalid confirm password' })

    if (await User.findOne({ attributes: ['user_name'], where: { user_name } }))
      return res.status(401).json({ error: 'user name already exists' })

    if (await User.findOne({ attributes: ['email'], where: { email } }))
      return res.status(401).json({ error: 'this email already exists' })

    const user = {
      user_name,
      email,
      password: await hashData(password), //hash password
      confirmation_token: generateToken(),
    }

    /*
             send confirmation token  to user email
        */
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    user.confirmation_token_expires = now

    const insertedUser = await User.create(user)

    sendConfirmationToken(insertedUser.email, insertedUser.confirmation_token)

    const token = jwt.sign(
      { userId: insertedUser.id },
      process.env.JWT_SECRET_KEY
    )

    if (token) {
      return res
        .status(201)
        .json({ token, email: insertedUser.email, user_id: insertedUser.id })
    }
  },

  async acountConfirmation(req, res) {
    const { email, confirmation_token } = req.body

    if (!confirmation_token) {
      return res.status(422).json({ error: 'invalid token' })
    }

    const user = await User.findOne({
      attributes: ['confirmation_token', 'confirmation_token_expires'],
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }
    if (user.confirmation_token !== confirmation_token) {
      return res.status(422).json({ error: 'invalid token' })
    }

    const now = new Date()

    if (now > user.confirmation_token_expires) {
      return res.status(400).json({ error: 'token expired generate new one' })
    }

    await User.update(
      { is_verified: true },
      {
        where: { email },
      }
    )

    return res.status(200).json({ is_verified: true })
  },

  async signin(req, res) {
    const { email, password } = req.body

    if (!email || !password)
      return res
        .status(422)
        .json({ erro: 'you need provide email and password' })

    const user = await User.findOne({
      attributes: ['id', 'email', 'password', 'is_verified'],
      where: { email },
    })

    if (!user)
      return res.status(422).json({ erro: 'invalid email or password' })

    if (!user.is_verified)
      return res.status(422).json({ erro: 'account without verification' })

    try {
      const isPassword = await bcrypt.compare(password, user.password)

      if (!isPassword)
        return res.status(422).json({ erro: 'invalid email or password' })

      //creating a token whit the user information
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY)
      return res.status(200).json({ token, user_id: user.id })
    } catch (error) {
      return res.status(422).json({ erro: 'invalid email or password' })
    }
  },

  async reSendConfirmationToken(req, res) {
    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user || user.is_verified) {
      return res.status(422).send()
    } else {
      const token = generateToken()

      const now = new Date()
      now.setMinutes(now.getMinutes() + 5)

      await User.update(
        {
          confirmation_token: token,
          confirmation_token_expires: now,
        },
        {
          where: { email },
        }
      )

      sendConfirmationToken(email, token)
      return res.send()
    }
  },

  //reset passwords ------------

  async forgotPassword(req, res) {
    const { email } = req.body

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return res.status(404).json({ error: 'user not found' })
      } else {
        const token = generateTokenResetPassword()
        const now = new Date()
        now.setMinutes(now.getMinutes() + 1)

        await User.update(
          {
            reset_password_token: token,
            reset_password_token_expires: now,
          },
          {
            where: { email },
          }
        )

        sendResetPasswordToken(email, token)
        return res.send()
      }
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'reset password fail' })
    }
  },

  async resetPassword(req, res) {
    const { email, password, token } = req.body

    try {
      const user = await User.findOne({
        attributes: ['reset_password_token', 'reset_password_token_expires'],
        where: { email },
      })

      if (!user) {
        return res.status(404).json({ error: 'user not found' })
      }
      if (token !== user.reset_password_token || !token) {
        return res.status(400).json({ error: 'invalid token' })
      }

      const now = new Date()

      if (now > user.reset_password_token_expires) {
        return res.status(400).json({ error: 'token expired generate new one' })
      }

      await User.update(
        {
          password: await hashData(password),
        },
        {
          where: { email },
        }
      )

      return res.status(200).json({ message: 'password updated' })
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'can not reset password tray again' })
    }
  },
}
