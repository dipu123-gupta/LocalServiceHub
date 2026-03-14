import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const updateCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await mongoose.connection.db.collection('categories').updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );
        console.log(`Updated ${result.modifiedCount} categories.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateCategories();
