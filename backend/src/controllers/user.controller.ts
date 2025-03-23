import { Request, Response } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { validationResult } from 'express-validator';
import logger from '../utils/logger';
import { successResponse, errorResponse } from '../utils/response';

const generateToken = (userId: string): string => {
  const secret = (process.env.JWT_SECRET || 'your_jwt_secret_key') as Secret;
  const options: SignOptions = {
    expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
  };
  return jwt.sign({ userId }, secret, options);
};

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    let user: IUser | null = await User.findOne({ email });
    if (user) {
      return res.status(400).json(errorResponse('User already exists, Use different email'));
    }

    // Create user
    user = new User({
      email,
      password,
      firstName,
      lastName
    });

    await user.save();

    if (!user._id) {
      throw new Error('User ID not generated');
    }

    // Generate token
    const token = generateToken(user._id.toString());

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json(successResponse('User registered successfully', {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }));
  } catch (error) {
    logger.error('Error in user registration:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { email, password } = req.body;

    // Check if user exists
    const user: IUser | null = await User.findOne({ email });
    if (!user || !user._id) {
      return res.status(400).json(errorResponse('Invalid credentials'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(errorResponse('Invalid credentials'));
    }

    // Generate token
    const token = generateToken(user._id.toString());

    logger.info(`User logged in: ${user.email}`);

    res.json(successResponse('Login successful', {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }));
  } catch (error) {
    logger.error('Error in user login:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    res.json(successResponse('Profile retrieved successfully', user));
  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, currency, timezone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (currency) user.currency = currency;
    if (timezone) user.timezone = timezone;

    await user.save();
    logger.info(`User profile updated: ${user.email}`);
    res.json(successResponse('Profile updated successfully', user));
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
}; 