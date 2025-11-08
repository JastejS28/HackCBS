import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.DB_PATH}/${process.env.DB_NAME}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
