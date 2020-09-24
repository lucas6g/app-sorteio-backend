const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

//midleware que serve para dar acesso as rotas da minha aplicacao
//somente aos usurios que tiverem token

module.exports = function (req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'you must be login' })
  }

  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (
    error,
    payload
  ) {
    if (error) {
      return res.status(401).json({ error: 'You most be login' })
    }
    //obejeto payload armazena a informacao que o jwt esta criptografando
    const { userId } = payload

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    req.userId = user.id
    next()
  })
}
