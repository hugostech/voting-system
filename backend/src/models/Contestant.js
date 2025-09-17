const mongoose = require('mongoose');

const contestantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    avatar: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/.+|\/uploads\/.+)$/.test(v);
            },
            message: 'Avatar must be a valid URL'
        }
    },
    votes: {
        type: Number,
        default: 0,
        min: 0
    },
    voters: [{
        email: String,
        votedAt: {
            type: Date,
            default: Date.now
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better query performance
contestantSchema.index({ votes: -1 });
contestantSchema.index({ 'voters.email': 1 });

module.exports = mongoose.model('Contestant', contestantSchema);