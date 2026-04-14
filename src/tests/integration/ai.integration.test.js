import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

import User from "../../models/user.js";
import app from "../appTest.js";
import db from './src/config/dbConnect.js';
var mongodb = process.env.ATLAS_URI_TEST


describe("AI test", () => {

    beforeAll(async () => {
        // connect to DB before start 
        await db(mongodb);
        await User.removeAllListeners({})

    });

    afterEach(async () => {
        //after each test it deletes everthing from db
        await User.deleteMany({});
    });

    afterAll(async () => {
        //after all test close connection
        await mongoose.connection.close();
    });

    test("should generate text Chat", async () => {

        const chatPromptToAI = {
            prompt:  "I am feeling good and calm today so can you recomend me which Museum should I visit? ",
            files: [],
            history: [],
        }

        const res = await request(app)
            .post("/api/getChat")
            .send(chatPromptToAI)
            .expect(200);

        console.log(res.body.data)
        expect(typeof res.body.data).toBe("string");
        expect(res.body.success).toBe(true);
    }, 12000) //give AI 12 seconds to respond

    test("should generate text with history Chat", async () => {

        const chatPromptToAI = {
            prompt: "do I like fossils?",
            files: [],
            history: [
                { role: "user", parts: [{ text: "Hi, museum red!"}]},
                {role: "model", parts: [{text: "Hello! OK, How can I help?"}]}
            ],
            
        }

        const res = await request(app)
            .post("/api/getChat")
            .send(chatPromptToAI)
            .expect(200);

        console.log(res.body.data)
        expect(typeof res.body.data).toBe("string");
        expect(res.body.success).toBe(true);
    }, 12000) //give AI 12 seconds to respond
})