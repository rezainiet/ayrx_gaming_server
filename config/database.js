import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000 // 15 seconds timeout
        });
        console.log('Database Connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

export default connectDB;
