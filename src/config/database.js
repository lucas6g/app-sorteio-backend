//arquivo de configuração da base de dados

require('dotenv').config()

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  define: {
    timestamps: true,
    underscored: true,
  },
}
