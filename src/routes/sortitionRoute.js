const { Router } = require('express')
const User = require('../models/User')
const Sortition = require('../models/Sortition')
const requireAuth = require('../middlewares/requireAuth')
const router = Router()

//create a new sortition
router.post('/sortition', requireAuth, async (req, res) => {
  const { sortition_date, title, rules } = req.body

  const user = await User.findByPk(req.userId)

  if (!user) {
    return res.status(400).json({ error: 'user not exists' })
  }

  const sortition = await Sortition.create({
    sortition_date,
    rules,
    user_id: user.id,
    title,
  })
  return res.status(201).json(sortition)
})

//listar sorteio especifico
router.get('/sortition', requireAuth, async (req, res) => {
  const { userId } = req

  //encontre todos os sorteios e o usuario que criou esse sorteio
  const sortitions = await Sortition.findAll({
    attributes: ['rules'],
    where: { user_id: userId },
    include: { association: 'users', attributes: ['user_name'] },
  })

  return res.status(200).json(sortitions)
})

module.exports = router
