const { Router } = require('express')
const User = require('../models/User')
const Raffle = require('../models/Raffle')
const router = Router()

router.post('/raffle', async (req, res) => {
  const { user_email, raffle_date, rules } = req.body

  const user = await User.findOne({
    where: { email: user_email },
  })

  console.log(user.id)

  if (!user) {
    return res.status(400).json({ error: 'user not exists' })
  }

  const raffle = await Raffle.create({
    raffle_date,
    rules,
    user_id: user.id,
  })
  return res.status(201).json(raffle)
})

module.exports = router
