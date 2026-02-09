const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
const cors = require("cors");

const AiRoute = require("./src/routes/aiRoute");
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

const PORT = process.env.PORT || 3001
const app = express()
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



app.listen(PORT, () => {
    console.log('Server starting on port', PORT)

})




