const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    contestantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contestant',
        required: true
    },
    voterEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    verificationCode: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    voteWeight: {
        type: Number,
        default: 1,
        min: 1
    },
    ipAddress: String,
    userAgent: String,
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // 1 hour
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate votes
voteSchema.index({ contestantId: 1, voterEmail: 1 }, { unique: true });
voteSchema.index({ verificationCode: 1 });

module.exports = mongoose.model('Vote', voteSchema);