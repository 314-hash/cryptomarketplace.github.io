const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if user is seller
const isSeller = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Seller access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Verify wallet signature
const verifyWalletSignature = async (req, res, next) => {
  try {
    const { signature, message, walletAddress } = req.body;

    if (!signature || !message || !walletAddress) {
      return res.status(400).json({ message: 'Signature verification failed: Missing parameters' });
    }

    // TODO: Implement actual signature verification using ethers.js or web3.js
    // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    // if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    //   return res.status(401).json({ message: 'Invalid signature' });
    // }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Signature verification failed' });
  }
};

// Add user's wallet address to request if connected
const attachWalletAddress = async (req, res, next) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];
    if (walletAddress) {
      req.walletAddress = walletAddress.toLowerCase();
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  isSeller,
  isAdmin,
  verifyWalletSignature,
  attachWalletAddress,
};
