module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Electronics',
        description: 'All kinds of electronic gadgets',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Furniture',
        description: 'Home and office furniture',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
