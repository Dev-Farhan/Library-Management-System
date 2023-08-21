import mongoose from "mongoose";

//Connection to the MongoDB Database
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/Management");
        console.log(`Connected To MOngoDB Database ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in MongoDB ${error}`);
    }
};