import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@solarsystem.pk',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin12345',
};
