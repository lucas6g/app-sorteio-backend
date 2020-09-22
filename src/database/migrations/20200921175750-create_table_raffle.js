'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('raffles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      raffle_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }, //cria uma chave estrangeira na tabel sorteio
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rules: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_valid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      user_name_winning_participant: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      number_participants: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('raffles')
  },
}
