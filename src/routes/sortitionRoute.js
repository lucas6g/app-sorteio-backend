const { Router } = require('express')
const User = require('../models/User')
const Sortition = require('../models/Sortition')

const requireAuth = require('../middlewares/requireAuth')
const router = Router()

//create a new sortition
router.post('/sortition', requireAuth, async (req, res) => {
  const {
    title,
    rules,
    award_name,
    award_img,
    description,
    day,
    month,
    year,
    hour,
    minute,
  } = req.body

  const sortition_date = new Date(year, month, day, hour, minute)

  const now = new Date()

  if (sortition_date < now) {
    return res.status(422).json({ error: 'invalid date for sortiton' })
  }
  const user = await User.findByPk(req.userId)

  if (!user) {
    return res.status(400).json({ error: 'you must be login' })
  }

  const sortition = await Sortition.create({
    sortition_date,
    rules,
    user_id: user.id,
    title,
    award_img,
    award_name,
    description,
  })

  return res.status(201).json(sortition)
})

//list especifc sortition
router.get('/sortition', requireAuth, async (req, res) => {
  const { userId } = req

  //encontre todos os sorteios e o usuario que criou esse sorteio
  const sortitions = await Sortition.findAll({
    attributes: ['sortition_date', 'title'],
    where: { user_id: userId },
    include: { association: 'creator', attributes: ['user_name'] },
  })

  return res.status(200).json(sortitions)
})

router.post(
  '/sortition/:sortition_id/participate',
  requireAuth,
  async (req, res) => {
    const { sortition_id } = req.params
    const userId = req.userId
    //presiso do id do sorteio que o usuario quer participar

    const user = await User.findByPk(userId)

    const sortition = await Sortition.findByPk(sortition_id)

    if (sortition.user_id === user.id) {
      return res.status(422).json({
        error: 'you cannot participate in this draw',
      })
    }

    await sortition.addUser(user)

    return res.json({ isParticipate: true })
  }
)

//rota de realizar um sorteio
router.get('/sortition/:sortition_id/performs', async (req, res) => {
  const { sortition_id } = req.params
  // const sortition = await Sortition.findOne({
  //   where: { id: sortition_id },
  //   include: { model: User, through: { attributes: [] } }, //att da tabela user
  //   attributes: ['title'], //atributos da tabela sorteio
  // })

  const sortition = await Sortition.findByPk(sortition_id)

  const participants = await sortition.getUsers({
    attributes: ['user_name'],
  })

  return res.json(participants)
})

module.exports = router
