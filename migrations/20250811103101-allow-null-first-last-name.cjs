// migrations/20250811120000-allow-null-first-last-name.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.changeColumn(
        'users',
        'first_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t }
      );

      await queryInterface.changeColumn(
        'users',
        'last_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `UPDATE "users" SET "first_name" = '' WHERE "first_name" IS NULL;`,
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `UPDATE "users" SET "last_name" = '' WHERE "last_name" IS NULL;`,
        { transaction: t }
      );

      await queryInterface.changeColumn(
        'users',
        'first_name',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t }
      );

      await queryInterface.changeColumn(
        'users',
        'last_name',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t }
      );
    });
  },
};
