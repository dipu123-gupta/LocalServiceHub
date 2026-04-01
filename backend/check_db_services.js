import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const checkServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const total = await Service.countDocuments();
        const pending = await Service.countDocuments({ moderationStatus: 'pending' });
        const approved = await Service.countDocuments({ moderationStatus: 'approved' });
        const active = await Service.countDocuments({ isActive: true });

        console.log(`Total Services: ${total}`);
        console.log(`Pending: ${pending}`);
        console.log(`Approved: ${approved}`);
        console.log(`Active: ${active}`);

        if (total > 0) {
            const sample = await Service.find().limit(5);
            console.log('Sample Services (Summary):');
            sample.forEach(s => {
                console.log(`- ID: ${s._id}, Title: ${s.title}, Status: ${s.moderationStatus}, Active: ${s.isActive}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkServices();
