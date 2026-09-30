import bcrypt from 'bcrypt';
import { pool } from '../../src/config/databaseConnection.js';

const seedUsers = async () => {
  try {
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    await pool.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES
        ($1, $2, $3, $4),
        ($5, $6, $7, $8)
      ON CONFLICT (email) DO NOTHING;
      `,
      [
        'Test Admin',
        'admin@test.com',
        adminPassword,
        'admin',

        'Test User',
        'user@test.com',
        userPassword,
        'user',
      ],
    );

    console.log('Test users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await pool.end();
  }
};

seedUsers();
