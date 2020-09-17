const Sequelize = require('sequelize')
const dbConfig = require('../config/database')
const User = require('../models/User')
//arquivo de conexao com o banco de dados

const conection = new Sequelize(dbConfig)
//iniciando os modals da minha aplicacao
User.init(conection)

module.exports = conection
