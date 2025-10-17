import mongoose from "mongoose";

export const connectDB = async () => {
        try{
                await mongoose.connect(process.env.MONGO_URI, {
			dbName:'test',
			ssl: true,
			serverSelectionTimeoutMS: 5000,
                });
                console.log("MongoDB connected");
        } catch (error) {
                console.error("MongoDB connection error:", error);
                process.exit(1);
        }
};
