"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
      },
      phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      profile_pic: {
        type: Sequelize.DataTypes.STRING,
      },
      cover_photo: {
        type: Sequelize.DataTypes.STRING,
      },
      create_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("users");
  },
};
