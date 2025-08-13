module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Smartphone',
        description: 'A high-quality smartphone',
        price: 500,
        stock: 100,
        category_id: 1,  // این فرض می‌کنیم که `Electronics` دارای `id=1` است
        image_url: 'https://example.com/smartphone.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Office Chair',
        description: 'Comfortable office chair',
        price: 150,
        stock: 50,
        category_id: 2,  // فرض می‌کنیم که `Furniture` دارای `id=2` است
        image_url: 'https://example.com/office-chair.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
