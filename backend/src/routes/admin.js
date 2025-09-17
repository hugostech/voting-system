const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Contestant = require('../models/Contestant');
const Vote = require('../models/Vote');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find admin
        const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                voteWeight: admin.voteWeight
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Get admin dashboard data
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const contestants = await Contestant.find({ isActive: true }).sort({ votes: -1 });
        const totalVotes = await Vote.countDocuments({ isVerified: true });
        const totalVoters = await Vote.distinct('voterEmail', { isVerified: true });

        const recentVotes = await Vote.find({ isVerified: true })
            .populate('contestantId', 'name')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('voterEmail contestantId voteWeight isAdmin createdAt');

        res.json({
            contestants,
            statistics: {
                totalVotes,
                totalVoters: totalVoters.length,
                totalContestants: contestants.length
            },
            recentVotes
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
    }
});

// Reset all votes
router.post('/reset-votes', authMiddleware, async (req, res) => {
    try {
        // Reset contestant votes
        await Contestant.updateMany(
            { isActive: true },
            { $set: { votes: 0, voters: [] } }
        );

        // Delete all vote records
        await Vote.deleteMany({});

        res.json({ message: 'All votes have been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset votes', error: error.message });
    }
});

// Update admin settings
router.put('/settings', authMiddleware, async (req, res) => {
    try {
        const { voteWeight } = req.body;

        const admin = await Admin.findByIdAndUpdate(
            req.user.id,
            { voteWeight },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ message: 'Settings updated successfully', admin });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update settings', error: error.message });
    }
});

module.exports = router;