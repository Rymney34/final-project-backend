// import jwtTokenProvider from "../security/auth/jwtTokenProvider.js";
import Museums from "../models/museum.js";
import multer from "multer";
import { S3Client, PutObjectCommand, LocationType } from "@aws-sdk/client-s3";
// import mongoose from "mongoose";
import lock from "../config/lock.js";


const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

// fucntion that acctually upload to s3 AWS
export const putObject = async (file, fileName) => {
    try {
        const params = {
            Bucket: "museums-welsh-heritage-bucket",
            Key: `museum-content/${fileName}`,
            Body: file.buffer,
            ContentType: "image/jpg,jpeg,png,mp4,heic",
        };

        const command = new PutObjectCommand(params);
        const data = await this.s3.send(command); 

        if (data.$metadata.httpStatusCode !== 200) {
            return;
        }
        let url = `https://museums-welsh-heritage-bucket.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${params.Key}`;
        console.log(url);
        return { url, key: params.Key };
    } catch (err) {
        console.error(err);
    }
};

// actual controller an important function for uploaing images to AWS
export const setMuseumPic = async (req, res) => {
    try {
        const file = req.file;
        const filename = `image-${Date.now()}-${file.originalname}`;
        const { url, key } = await this.putObject(file, filename); // Call as method

        if (!url || !key) {
            return res.status(400).json({
                status: "error",
                data: "Image is not uploaded",
            });
        }
        res.json({ success: true, url, key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// actual controller an important function for uploaing images to AWS
export const setMuseumVideo = async (req, res) => {
    try {
        const file = req.file;
        const filename = `video-${Date.now()}-${file.originalname}`;
        const { url, key } = await this.putObject(file, filename); // Call as method

        if (!url || !key) {
            return res.status(400).json({
                status: "error",
                data: "Video is not uploaded",
            });
        }
        res.json({ success: true, url, key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createMuseum = async (req, res) => {
    const lockKey = 'allMuseumcreation'; // unique for reference 
    try {
        // getting user from frontend 
        const {
            firstPageImage,
            museumTitle,
            openingTime,
            cotactInfo,
            accessiblityInfo,
            location,
            slider,
            video,
            virtualTours,
            map,
        } = req.body;
        // check that all not null or undefined that there is value
        if (!museumTitle || !firstPageImage) { return res.status(400).json({ message: "Missing required fields" }); }

        // lock booking or allows to have queue of adding museums on the user side 
        const newMuseum= await lock.acquire(lockKey, async () => {
            // creating actual Museum
            const addMuseum = new Museums({
                user: req.user.sub,
                firstPageImage,
                museumTitle,
                openingTime,
                cotactInfo,
                accessiblityInfo,
                location,
                slider,
                video,
                virtualTours,
                map,
            });
            // saving booking into db
            await addMuseum.save(); // throws an error if document was update by another process
            return addMuseum;
        });

        // returning success and 201
        res.status(201).json({
            success: true,
            data: newMuseum,
            message: "Good job, Museum is submitted/added"
        });

        // catching error special and unique code to check if this booking already exists 
    } catch (error) {
        if (error.code === 11000) {
            // throws 409 to front with certain json data
            return res.status(409).json({
                success: false,
                message: "Unfortunately musuem alredy exist"
            });
        }
       
        console.error("Error :", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
        res.status(400).json({ error: error.message });
    }
}

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single("museumImage");


