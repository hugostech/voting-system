const mongoose = require('mongoose');
const Contestant = require('../models/Contestant');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Contestant.deleteMany({});
        await Admin.deleteMany({});

        // Create default contestants
        const contestants = [
            {
                name: 'Alex Johnson',
                description: 'Experienced software engineer with expertise in full-stack development and team leadership.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
            },
            {
                name: 'Sarah Chen',
                description: 'Creative designer and UX specialist focused on creating intuitive user experiences.',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
            },
            {
                name: 'Michael Rodriguez',
                description: 'Data scientist and machine learning expert with a passion for solving complex problems.',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
            },
            {
                name: 'Emily Davis',
                description: 'Product manager with a track record of delivering successful digital products.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
            }
        ];

        await Contestant.insertMany(contestants);
        console.log('Contestants created successfully');

        // Create default admin
        const admin = new Admin({
            email: 'admin@example.com',
            password: 'admin123',
            voteWeight: 20
        });

        await admin.save();
        console.log('Admin user created successfully');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();