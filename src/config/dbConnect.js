import mongoose from "mongoose";
import dotenv from 'dotenv';

const connectDb = async (uri) => {
    
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB")
        
    }catch(error){
        console.error("Connection failed ", error.message)
    }
}

export default connectDb
