import User from './models/User.js';
import bcrypt from 'bcryptjs';
import { config } from './config.js';

export async function ensureAdminAccount() {
  try {
    const existing = await User.findOne({ email: config.adminEmail.toLowerCase() });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('Existing user promoted to admin:', config.adminEmail);
      }
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.adminPassword, salt);

    await User.create({
      name: 'Admin',
      email: config.adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });

    console.log('Admin account created:');
    console.log('  Email:', config.adminEmail);
    console.log('  Password: (set via ADMIN_PASSWORD env variable)');
    console.log('  Please change the password after first login.');
  } catch (err) {
    console.error('Failed to create admin account:', err.message);
  }
}
