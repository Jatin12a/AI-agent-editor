import userModel from '../models/userModel.js';
import * as userServices from '../services/userServices.js';
import { validationResult } from 'express-validator';
import BlackList from '../models/blacklistModel.js';
import jwt from 'jsonwebtoken';

export const createUserController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userServices.createUser(req.body);
        const token = await user.generateAuthToken();
        return res.status(201).json({user, token});
    } catch (error) {
            return res.status(400).json({error: error.message});
    }
};

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email}).select('+password');
        if (!user) {
            res.status(404).json({error: 'User not found'});
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            res.status(400).json({error: 'Invalid credentials'});
        }
        const token = await user.generateAuthToken();
        return res.status(200).json({user, token});
        
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({error: error.message});
            }
}


export const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const decoded = jwt.decode(token);
        const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days

        await BlackList.create({ token, expiresAt });

        res.cookie('token', '', { expires: new Date(0), httpOnly: true });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

