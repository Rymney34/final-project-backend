import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

import Museum from "../../models/museum.js";
import app from "../appTest.js";
import db from './src/config/dbConnect.js';
var mongodb = process.env.ATLAS_URI_TEST


describe("Authentication User Integration DB", () => {

    beforeAll(async () => {
        // connect to DB before start 
        await db(mongodb);
        await Museum.removeAllListeners({})

    });

    afterEach(async () => {
        //after each test it deletes everthing from db
        await Museum.deleteMany({});
    });

    afterAll(async () => {
        //after all test close connection
        await mongoose.connection.close();
    });

    test("should create museumItem", async () => {

        const newMuseum = {
            firstPageImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png",
            museumTitle: "The Grand Gallery of Art",
            openingTime: "09:00 - 18:00",
            contactInfo: "+44 123 456 789",
            accessiblityInfo: "Wheelchair accessible, elevators available on all floors.",
            location: "123 Museum Way, London",
            map3d: "51.485496, -3.176719",
            map: "51.485852416749516, -3.177821578",
            slider: [
                {
                    slideTitle: "Renaissance Hall",
                    slideDescription: "A collection of 15th-century masterpieces.",
                    slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                },
                {
                    slideTitle: "Modern Exhibit",
                    slideDescription: "Exploring digital art in the 21st century.",
                    slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                }
            ],
            video: "https://www.youtube.com/watch?v=XQw2r6jJ6sE&t=2s",
            virtualTours: [
                {
                    tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                },
                {
                    tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                }
            ]
        };

        const res = await request(app)
            .post("/api/createMuseum")
            .send(newMuseum)
            .expect(201);

        expect(res.body.data).toMatchObject(newMuseum);
        expect(res.body.data.museumTitle).toBe("The Grand Gallery of Art");
        expect(res.body.success).toBe(true);
    })
})