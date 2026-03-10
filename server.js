import express from 'express';
import dotenv from 'dotenv';


import cors from "cors";

import AiRoute from "./src/routes/aiRoute.js";
import MuseumRoute from "./src/routes/museumRoute.js";
import db from './src/config/dbConnect.js'; 
// const cookieParser = require('cookie-parser');
// const mongoSanitize = require("express-mongo-sanitize");
// const path = require('path');

// const connectDB = require('./config/dbConnect');
// Connect to MongoDB Databases
// const db = require('./config/dbConnect');
// const uploadImage = require("./imageUploader/imageUploader.js");

// (async () => {
//     await db.connect(process.env.ATLAS_URI);
// })();

dotenv.config();

const PORT = process.env.PORT || 3001
const app = express()

;(async () => {
    try{
        console.log("gazoz")
        await db(process.env.ATLAS_URI);
    }catch (error){
        console.error("db erorr", error)
    }
})();
// uploadImage()
// connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//calling cors
app.use(cors());
//calling cookies func
// app.use(cookieParser())
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend OK ✅" });
});

app.use("/api", AiRoute);
app.use("/api", MuseumRoute);



app.listen(PORT, () => {
    console.log('Server starting on port', PORT)

})




