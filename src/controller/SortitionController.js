const User = require('../models/User')
const Sortition = require('../models/Sortition')
const { QueryTypes } = require('sequelize')
const connection = require('../database')

module.exports = {
  async createSortition(req, res) {
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
  },

  async getAllSortitionsCreatedByUser(req, res) {
    const { userId } = req

    //encontre  os sorteios que um usuario especifico criou
    const sortitions = await Sortition.findAll({
      attributes: ['sortition_date', 'title'],
      where: { user_id: userId },
      include: { association: 'creator', attributes: ['user_name'] },
    })

    return res.status(200).json(sortitions)
  },

  async participateSortition(req, res) {
    const { sortition_id } = req.params
    const userId = req.userId
    //presiso do id do sorteio que o usuario quer participar

    const user = await User.findByPk(userId)

    const sortition = await Sortition.findByPk(sortition_id)

    //o usuario que criou o sorteio nao pode participar dele
    if (sortition.user_id === user.id) {
      return res.status(422).json({
        error: 'you cannot participate in this draw',
      })
    }

    await sortition.addUser(user)

    const sql = `update sortitions set number_participants = number_participants + 1 where id = ${sortition_id}`
    await connection.query(sql, { type: QueryTypes.UPDATE })

    return res.json({ isParticipate: true })
  },

  async performSortition(req, res) {
    const { sortition_id } = req.params

    const sortition = await Sortition.findByPk(sortition_id)

    if (req.userId !== sortition.user_id)
      return res.status(422).json({ error: 'invalid credentials' })

    //buscando todos os participantes que fazem parte desse sorteio
    const participants = await sortition.getUsers({
      attributes: ['user_name'],
    })

    return res.json(participants)
  },

  async getParticipingSortitions(req, res) {
    const sql = `SELECT title FROM sortitions 
    INNER JOIN users_sortitions  ON sortitions.id = users_sortitions.sortition_id
    WHERE users_sortitions.user_id = ${req.userId}`

    const sortitions = await connection.query(sql, { type: QueryTypes.SELECT })

    return res.json(sortitions)
  },

  async findSortitions(req, res) {
    const { award_name } = req.query

    const sql = ` select title,award_img,award_name,user_name from sortitions inner join users on sortitions.user_id = users.id where sortitions.award_name like '%${award_name}%' `
    const sortitions = await connection.query(sql, { type: QueryTypes.SELECT })

    return res.json(sortitions)
  },
}
