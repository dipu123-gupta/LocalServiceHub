import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const checkServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const total = await Service.countDocuments();
    const approved = await Service.countDocuments({ moderationStatus: 'approved' });
    const pending = await Service.countDocuments({ moderationStatus: 'pending' });
    const active = await Service.countDocuments({ isActive: true });
    
    console.log(`Total Services: ${total}`);
    console.log(`Approved: ${approved}`);
    console.log(`Pending: ${pending}`);
    console.log(`Active: ${active}`);

    const sample = await Service.find().limit(5).populate('category', 'name').populate('provider', 'businessName');
    console.log('Sample Services:', JSON.stringify(sample, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkServices();
