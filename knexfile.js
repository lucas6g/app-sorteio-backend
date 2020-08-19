// configuraçoes do banco de dados 

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database:'app-sorteio',
      user:'postgres',
      password:'YnvJm54o',
      port:5432,
      host:'localhost'

    },
    migrations:{
      directory:`${__dirname}/src/database/migrations`
    }
  },

};
