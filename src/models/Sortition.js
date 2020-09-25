const { Model, DataTypes } = require('sequelize')

// os models da minha aplicacao devem ter realacionamentos assim comos as tabelas

class Sortition extends Model {
  static init(connection) {
    super.init(
      {
        //passar os dados da tabela para o model referenciar
        title: DataTypes.STRING,
        sortition_date: DataTypes.DATE,
        rules: DataTypes.STRING,
        is_valid: DataTypes.BOOLEAN,
        user_name_winning_participant: DataTypes.STRING,
        number_participants: DataTypes.INTEGER,
        award_name: DataTypes.STRING,
        award_img: DataTypes.STRING,
      },
      {
        sequelize: connection, //passar a conexao com o banco de dados
      }
    )
  }
  static associate(models) {
    //devo dar um nome para cada relacionamento
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'creator' }) //passar a chave estrangeira da tabela de sorteio
    this.belongsToMany(models.User, {
      foreignKey: 'sortition_id',
      through: 'users_sortitions',
      as: 'participants',
    })
  }
}

module.exports = Sortition
