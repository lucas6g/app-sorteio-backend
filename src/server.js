const express = require('express')
const cors = require('cors')
const authRoute = require('./routes/authRoute')

const routes = require('./routes')
const app = express()

//conectando no banco de dados
require('./database')

app.use(cors())
app.use(express.json())
//para usar as rotas basta passar o midleware
app.use(authRoute)
app.use(routes)

app.listen(3333, () => {
  console.log('servidor rodando na port 3333')
})
