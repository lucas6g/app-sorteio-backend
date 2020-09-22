const Sequelize = require('sequelize')
const dbConfig = require('../config/database')
const User = require('../models/User')
const Raffle = require('../models/Raffle')

//arquivo de conexao com o banco de dados

const conection = new Sequelize(dbConfig)
//iniciando os modals da minha aplicacao
User.init(conection)
Raffle.init(conection)

//associando os modals
Raffle.associate(conection.models)

module.exports = conection
