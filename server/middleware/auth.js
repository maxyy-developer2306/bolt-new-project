import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function adminAuth(req, res, next) {
  auth(req, res, () => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
  });
}
