import User from '../models/user.model.js';

// Sync user from Firebase to MongoDB
export const syncUser = async (req, res) => {
    try {
        const { uid, email, displayName, photoURL, providerData } = req.body;

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Find or create user
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                email,
                displayName: displayName || email.split('@')[0],
                photoURL: photoURL || '',
                provider: providerData?.[0]?.providerId || 'google.com',
                lastLogin: new Date()
            });
        } else {
            // Update existing user
            user.displayName = displayName || user.displayName;
            user.photoURL = photoURL || user.photoURL;
            user.lastLogin = new Date();
            await user.save();
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('User sync error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
