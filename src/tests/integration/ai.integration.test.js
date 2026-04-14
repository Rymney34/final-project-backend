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

    test("should Generate Chat", async () => {

        const promptToAI = "I am feeling good and calm today so can you recomend me which Museum should I visit? "

        const res = await request(app)
            .post("/api/createMuseum")
            .send(newMuseum)
            .expect(201);

        expect(res.body.data).toMatchObject(newMuseum);
        expect(res.body.data.museumTitle).toBe("The Grand Gallery of Art");
        expect(res.body.success).toBe(true);
    })
})