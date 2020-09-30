const express = require('express')
const cors = require('cors')
const authRoute = require('./routes/authRoute')
const sortitionRoute = require('./routes/sortitionRoute')
const routes = require('./routes')
const app = express()

//conectando no banco de dados
require('./database')

app.use(cors())
app.use(express.json())
//para usar as rotas basta passar o midleware
app.use(routes)
app.use(authRoute)
app.use(sortitionRoute)

app.listen(3333, () => {
  console.log('servidor rodando na port 3333')
})
