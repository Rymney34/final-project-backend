import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import AiRoute from "./src/routes/aiRoute.js";
import MuseumRoute from "./src/routes/museumRoute.js";
import UserRoute from "./src/routes/userRoute.js";
import LibraryRoute from "./src/routes/libraryRoute.js";
import EventRoute from "./src/routes/eventsRoute.js";
import db from './src/config/dbConnect.js'; 
import cookieParser from 'cookie-parser';



const PORT = process.env.PORT || 3001
const app = express()

;(async () => {
    try{
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
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
//calling cookies func
app.use(cookieParser());



app.get("/api/test", (req, res) => {
    res.json({ message: "Backend OK ✅" });
});


app.listen(PORT, () => {
    console.log('Server starting on port', PORT)

})

app.use("/api", AiRoute);
app.use("/api", MuseumRoute);
app.use("/api", UserRoute);
app.use("/api", LibraryRoute);
app.use("/api", EventRoute);




