const { Model, DataTypes } = require('sequelize')

// os models da minha aplicacao devem ter realacionamentos assim comos as tabelas

class Raffle extends Model {
  static init(connection) {
    super.init(
      {
        //passar os dados da tabela para o model referenciar
        raffle_date: DataTypes.DATE,
        rules: DataTypes.STRING,
        is_valid: DataTypes.BOOLEAN,
        user_name_winning_participant: DataTypes.STRING,
        number_participants: DataTypes.INTEGER,
      },
      {
        sequelize: connection, //passar a conexao com o banco de dados
      }
    )
  }
  static associate(models) {
    //para identificar um ralacionamento do outro
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'performs' }) //passar a chave estrangeira da tabela de sorteio
  }
}

module.exports = Raffle
