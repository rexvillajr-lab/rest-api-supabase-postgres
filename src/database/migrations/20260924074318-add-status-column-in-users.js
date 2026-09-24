"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "status", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET status = true
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "provider_status");
  },
};
