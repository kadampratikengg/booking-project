require('dotenv').config();
const { connectDB } = require('../src/config/db');
const AdminUser = require('../src/models/AdminUser');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await connectDB();

    const email = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'SuperSecret123!';
    const name = process.env.SUPERADMIN_NAME || 'Super Admin';

    const exists = await AdminUser.findOne({ email });
    if (exists) {
      console.log('SuperAdmin already exists:', exists.email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({
      name,
      email,
      password: hashed,
      role: 'SuperAdmin',
    });

    console.log('Created SuperAdmin:', user.email);
    console.log(
      'Use these credentials to login:\n',
      `email: ${email}`,
      `password: ${password}`
    );
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();
