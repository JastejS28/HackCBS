import User from '../models/user.model.js';

// Get current user profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-__v');
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { displayName } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { displayName },
            { new: true, runValidators: true }
        ).select('-__v');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete user account
export const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isActive: false });

        res.status(200).json({
            success: true,
            message: 'Account deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
