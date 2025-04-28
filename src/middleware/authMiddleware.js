import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes - verify token and set req.user
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token id (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Check if user is brand manager
export const brandManager = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'brand_manager')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as brand manager' });
  }
};

// Check if user is content creator
export const contentCreator = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'brand_manager' || req.user.role === 'content_creator')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as content creator' });
  }
};
