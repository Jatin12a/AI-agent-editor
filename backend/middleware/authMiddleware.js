import jwt from 'jsonwebtoken';
import BlackList from '../models/blacklistModel.js';

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Please authenticate.' });
        }

        
        const blacklistedToken = await BlackList.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: 'Token is blacklisted. Please log in again.' });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token. Please authenticate.' });
    }
};
