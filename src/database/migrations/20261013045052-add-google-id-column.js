"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add Google account identifier
    await queryInterface.addColumn("users", "google_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    // Ensure each Google ID belongs to only one user
    await queryInterface.addConstraint("users", {
      fields: ["google_id"],
      type: "unique",
      name: "users_google_id_unique",
    });

    // Allow Google-only accounts to have no password
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique constraint first
    await queryInterface.removeConstraint("users", "users_google_id_unique");

    // Remove Google ID column
    await queryInterface.removeColumn("users", "google_id");

    // Restore the password column requirement
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
