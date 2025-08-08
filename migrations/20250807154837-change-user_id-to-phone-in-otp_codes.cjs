module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('otp_codes', 'user_id', 'phone');
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.renameColumn('otp_codes', 'phone', 'user_id');
  }
};
