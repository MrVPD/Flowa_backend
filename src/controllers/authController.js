import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Verification from '../models/verificationModel.js';
import { OAuth2Client } from 'google-auth-library';
import { generateVerificationToken, sendVerificationEmail, sendVerificationCode } from '../utils/emailUtils.js';
import crypto from 'crypto';

import dotenv from 'dotenv';

dotenv.config();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate a random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register - Send verification code
// @route   POST /api/users/register-begin
// @access  Public
export const beginRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã được sử dụng. Vui lòng sử dụng email khác.' });
    }

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Store the verification code and user data
    await Verification.findOneAndDelete({ email }); // Remove any existing verification
    await Verification.create({
      email,
      code: verificationCode,
      userData: { name, email, password },
    });

    // Send verification email
    await sendVerificationCode(email, verificationCode);

    res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email của bạn.' });
  } catch (error) {
    console.error('Error in beginRegistration:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify registration code and create user
// @route   POST /api/users/register-complete
// @access  Public
export const completeRegistration = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find the verification entry
    const verification = await Verification.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn.' });
    }

    const { name, password } = verification.userData;

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: true,
    });

    // Delete the verification entry
    await Verification.findByIdAndDelete(verification._id);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Existing registerUser function - keep as backup or for direct registration if needed
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'content_creator',
      verificationToken,
      verificationTokenExpiry,
    });

    if (user) {
      // Send verification email
      await sendVerificationEmail(user, verificationToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email with token
// @route   GET /api/users/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Liên kết xác nhận không hợp lệ hoặc đã hết hạn' });
    }

    // Update user
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Email đã được xác nhận thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google authentication
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    console.log('Google Auth Request - Token ID received:', tokenId ? 'yes' : 'no');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'missing');
    
    if (!tokenId) {
      return res.status(400).json({ message: 'Token ID is required' });
    }
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    
    console.log('Google Auth - User verified:', { email, name: name || 'not provided' });
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: name || email.split('@')[0], // Use email prefix if name not provided
        email,
        password: randomPassword,
        googleId,
        isEmailVerified: true, // Google already verified the email
      });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google auth error:', error);
    const errorMessage = error.message || 'Lỗi xác thực với Google';
    res.status(500).json({ message: errorMessage });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user API keys
// @route   PUT /api/users/api-keys
// @access  Private
export const manageApiKeys = async (req, res) => {
  try {
    const { apiKeys } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.apiKeys = apiKeys;
    await user.save();

    res.json({ message: 'API keys updated successfully', apiKeys: user.apiKeys });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
