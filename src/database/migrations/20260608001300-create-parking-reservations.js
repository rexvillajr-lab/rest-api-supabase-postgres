"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("parking_reservations", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      parking_space_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "parking_spaces",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      plate_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      parking_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      duration_hours: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "booked"
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
    await queryInterface.dropTable("parking_reservations");
  }
};
