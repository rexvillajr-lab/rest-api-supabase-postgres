"use strict";

const { randomUUID } = require("crypto");
const { hashPassword } = require("../../utils/password");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const users = [
      {
        id: randomUUID(),
        first_name: "System",
        last_name: "Admin",
        phone_number: "09170000001",
        user_type_id: 1,
        email: "admin@park.local",
        password: await hashPassword("admin123"),
        is_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        id: randomUUID(),
        first_name: "Paula",
        last_name: "Provider",
        phone_number: "09170000002",
        user_type_id: 2,
        email: "provider@park.local",
        password: await hashPassword("provider123"),
        is_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        id: randomUUID(),
        first_name: "Nina",
        last_name: "User",
        phone_number: "09170000003",
        user_type_id: 3,
        email: "user@park.local",
        password: await hashPassword("user123"),
        is_verified: false,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: {
        [Sequelize.Op.in]: [
          "admin@park.local",
          "provider@park.local",
          "user@park.local"
        ]
      }
    });
  }
};
