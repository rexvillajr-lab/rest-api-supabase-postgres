"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("parking_spaces", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      space_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      price_per_hour: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      slots_available: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("parking_spaces");
  }
};
