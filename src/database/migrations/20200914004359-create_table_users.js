'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        isEmail: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      whatsapp: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      img_profile: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmation_token: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      token_winning_participant: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token_winning_participant_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reset_password_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      reset_password_token_expires: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('users')
  },
}
