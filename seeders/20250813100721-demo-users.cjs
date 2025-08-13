module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Ali',
        last_name: 'Reza',
        phone: '09210000000',
        email: 'ali.reza@example.com',
        password_hash: 'hashedpassword1',  // در واقع باید یک هش واقعی از پسورد قرار دهید
        role: 'admin',
        is_verified: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: 'Sara',
        last_name: 'Ahmadi',
        phone: '09210000001',
        email: 'sara.ahmadi@example.com',
        password_hash: 'hashedpassword2',  // یک هش واقعی
        role: 'user',
        is_verified: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: 'Reza',
        last_name: 'Mohammadi',
        phone: '09210000002',
        email: 'reza.mohammadi@example.com',
        password_hash: 'hashedpassword3',  // یک هش واقعی
        role: 'user',
        is_verified: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
