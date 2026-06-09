"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "provider_status", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET provider_status = true
      WHERE user_type_id = 2
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "provider_status");
  }
};
