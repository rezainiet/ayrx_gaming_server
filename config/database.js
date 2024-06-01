import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser and useUnifiedTopology options are no longer needed
        });
        console.log('Database Connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

export default connectDB;
