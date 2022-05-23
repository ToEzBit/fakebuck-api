"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("posts", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("posts");
  },
};
