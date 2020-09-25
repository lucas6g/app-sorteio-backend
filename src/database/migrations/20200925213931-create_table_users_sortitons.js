'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users_sortitions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }, //cria uma chave estrangeira na tabel sorteio
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sortition_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sortitions', key: 'id' }, //cria uma chave estrangeira na tabel sorteio
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('users_sortitions')
  },
}
