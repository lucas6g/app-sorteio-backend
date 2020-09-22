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
        confirmation_token_expires: DataTypes.DATE,
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
}

module.exports = User
