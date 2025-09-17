const express = require('express');
const rateLimit = require('express-rate-limit');
const Vote = require('../models/Vote');
const Contestant = require('../models/Contestant');
const Admin = require('../models/Admin');
const { sendVerificationEmail } = require('../services/emailService');
const router = express.Router();

// Rate limiting for vote requests
const voteLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 5 vote attempts per windowMs
    message: 'Too many vote attempts, please try again later.'
});

router.use(voteLimit);

// Send verification code
router.post('/send-verification', async (req, res) => {
    try {
        const { email, contestantId } = req.body;

        if (!email || !contestantId) {
            return res.status(400).json({ message: 'Email and contestant ID are required' });
        }

        // Check if email already voted for this contestant
        const existingVote = await Vote.findOne({
            voterEmail: email.toLowerCase(),
            isVerified: true
        });

        if (existingVote) {
            return res.status(400).json({ message: 'This email has already voted' });
        }

        // Check if contestant exists
        const contestant = await Contestant.findById(contestantId);
        if (!contestant) {
            return res.status(404).json({ message: 'Contestant not found' });
        }

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if admin
        const isAdmin = await Admin.findOne({ email: email.toLowerCase(), isActive: true });
        const voteWeight = isAdmin ? isAdmin.voteWeight : 1;

        // Save verification record
        const vote = new Vote({
            contestantId,
            voterEmail: email.toLowerCase(),
            verificationCode,
            isAdmin: !!isAdmin,
            voteWeight,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        await vote.save();

        // Send verification email
        await sendVerificationEmail(email, verificationCode, contestant.name);

        res.json({
            message: 'Verification code sent successfully',
            isAdmin: !!isAdmin,
            voteWeight
        });
    } catch (error) {
        console.error('Send verification error:', error);
        res.status(500).json({ message: 'Failed to send verification code', error: error.message });
    }
});

// Verify and submit vote
router.post('/verify-and-vote', async (req, res) => {
    try {
        const { email, contestantId, verificationCode } = req.body;

        if (!email || !contestantId || !verificationCode) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the verification record
        const vote = await Vote.findOne({
            voterEmail: email.toLowerCase(),
            contestantId,
            verificationCode,
            isVerified: false
        });

        if (!vote) {
            return res.status(400).json({ message: 'Invalid verification code or already used' });
        }

        // Mark as verified
        vote.isVerified = true;
        await vote.save();

        // Update contestant votes
        const contestant = await Contestant.findById(contestantId);
        contestant.votes += vote.voteWeight;
        contestant.voters.push({
            email: email.toLowerCase(),
            isAdmin: vote.isAdmin
        });

        await contestant.save();

        res.json({
            message: 'Vote submitted successfully',
            voteWeight: vote.voteWeight,
            isAdmin: vote.isAdmin,
            totalVotes: contestant.votes
        });
    } catch (error) {
        console.error('Vote verification error:', error);
        res.status(500).json({ message: 'Failed to verify and submit vote', error: error.message });
    }
});

// Get vote statistics (Admin only)
router.get('/statistics', async (req, res) => {
    try {
        const stats = await Vote.aggregate([
            { $match: { isVerified: true } },
            {
                $group: {
                    _id: '$contestantId',
                    totalVotes: { $sum: '$voteWeight' },
                    voterCount: { $sum: 1 },
                    adminVotes: {
                        $sum: {
                            $cond: [{ $eq: ['$isAdmin', true] }, '$voteWeight', 0]
                        }
                    }
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
    }
});

module.exports = router;