const express = require('express')
const knex = require('./database/connection')
const router = express.Router()
const UserController = require('./controller/UserController')





//register user
router.post('/sinup',UserController.signup)




module.exports = router