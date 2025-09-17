const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Contestant = require('../models/Contestant');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Helpers to construct public URL for uploads and resolve local file paths
const makePublicUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`;
const isLocalAvatar = (value, req) => {
    if (!value) return false;
    const absPrefix = `${req.protocol}://${req.get('host')}/uploads/`;
    return value.startsWith('/uploads/') || value.startsWith(absPrefix);
};
const getLocalUploadPath = (value) => {
    const filename = path.basename(value);
    return path.join(__dirname, '../../uploads', filename);
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'contestant-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get all contestants (public)
router.get('/', async (req, res) => {
    try {
        const contestants = await Contestant.find({ isActive: true })
            .select('-voters.email')
            .sort({ createdAt: -1 });

        res.json(contestants);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contestants', error: error.message });
    }
});

// Get single contestant (public)
router.get('/:id', async (req, res) => {
    try {
        const contestant = await Contestant.findById(req.params.id)
            .select('-voters.email');

        if (!contestant) {
            return res.status(404).json({ message: 'Contestant not found' });
        }

        res.json(contestant);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contestant', error: error.message });
    }
});

// Create new contestant with image upload (Admin only)
router.post('/', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        let avatar = '';
        if (req.file) {
            avatar = makePublicUrl(req, req.file.filename);
        } else if (req.body.avatar) {
            // URL provided instead of file upload
            avatar = req.body.avatar;
        } else {
            return res.status(400).json({ message: 'Avatar is required (file upload or URL)' });
        }

        const contestant = new Contestant({
            name: name.trim(),
            description: description.trim(),
            avatar
        });

        await contestant.save();
        res.status(201).json(contestant);
    } catch (error) {
        // Clean up uploaded file if contestant creation fails
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to delete uploaded file:', unlinkError);
            }
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Contestant with this name already exists' });
        }

        res.status(400).json({ message: 'Failed to create contestant', error: error.message });
    }
});

// Update contestant with optional image upload (Admin only)
router.put('/:id', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const contestant = await Contestant.findById(req.params.id);

        if (!contestant) {
            return res.status(404).json({ message: 'Contestant not found' });
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();

        // Handle avatar update
        if (req.file) {
            // New file uploaded
            updateData.avatar = makePublicUrl(req, req.file.filename);

            // Delete old file if it was a local upload
            if (isLocalAvatar(contestant.avatar, req)) {
                try {
                    const oldFilePath = getLocalUploadPath(contestant.avatar);
                    await fs.unlink(oldFilePath);
                } catch (error) {
                    console.error('Failed to delete old avatar:', error);
                }
            }
        } else if (req.body.avatar && req.body.avatar !== contestant.avatar) {
            // URL provided
            updateData.avatar = req.body.avatar;

            // Delete old file if it was a local upload
            if (isLocalAvatar(contestant.avatar, req)) {
                try {
                    const oldFilePath = getLocalUploadPath(contestant.avatar);
                    await fs.unlink(oldFilePath);
                } catch (error) {
                    console.error('Failed to delete old avatar:', error);
                }
            }
        }

        const updatedContestant = await Contestant.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedContestant);
    } catch (error) {
        // Clean up uploaded file if update fails
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to delete uploaded file:', unlinkError);
            }
        }

        res.status(400).json({ message: 'Failed to update contestant', error: error.message });
    }
});

// Delete contestant (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const contestant = await Contestant.findById(req.params.id);

        if (!contestant) {
            return res.status(404).json({ message: 'Contestant not found' });
        }

        // Delete avatar file if it's a local upload
        if (isLocalAvatar(contestant.avatar, req)) {
            try {
                const filePath = getLocalUploadPath(contestant.avatar);
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Failed to delete avatar file:', error);
            }
        }

        // Soft delete by setting isActive to false
        await Contestant.findByIdAndUpdate(req.params.id, { isActive: false });

        res.json({ message: 'Contestant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete contestant', error: error.message });
    }
});

module.exports = router;