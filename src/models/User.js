const { Model, DataTypes } = require('sequelize')

// os models da minha aplicacao devem ter realacionamentos assim comos as tabelas

class User extends Model {
  static init(connection) {
    super.init(
      {
        //passar os dados da tabela para o model referenciar

        user_name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        whatsapp: DataTypes.STRING,
        img_profile: DataTypes.STRING,
        is_verified: DataTypes.BOOLEAN,
        confirmation_token: DataTypes.INTEGER,
        token_winning_participant: DataTypes.STRING,
        token_winning_participant_expires: DataTypes.DATE,
        reset_password_token: DataTypes.STRING,
        reset_password_token_expires: DataTypes.DATE,
      },
      {
        sequelize: connection, //passar a conexao com o banco de dados
      }
    )
  }
  static associate(models) {
    this.hasMany(models.Sortition, { as: 'sortitions', foreignKey: 'user_id' })
    //always use belongsToMany to n:n
    //quais são os sorteios que esse usuario esta participando
    this.belongsToMany(models.Sortition, {
      through: 'users_sortitions',
    })
  }
}

module.exports = User
