module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('otp_codes', 'user_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('otp_codes', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
