import admin from '../config/firebase.js';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify the Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Find or create user in our database
        let user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (!user) {
            user = await User.create({
                firebaseUid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name,
                photoURL: decodedToken.picture,
                provider: decodedToken.firebase.sign_in_provider
            });
        } else {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
        }

        // Attach user to request
        req.user = user;
        req.firebaseUser = decodedToken;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
