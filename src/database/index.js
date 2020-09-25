const Sequelize = require('sequelize')
const dbConfig = require('../config/database')
const User = require('../models/User')
const Sortition = require('../models/Sortition')

//arquivo de conexao com o banco de dados

const conection = new Sequelize(dbConfig)
//iniciando os modals da minha aplicacao
User.init(conection)
Sortition.init(conection)

//associando os modals
//criar associação simultanea
User.associate(conection.models)
Sortition.associate(conection.models)

module.exports = conection
