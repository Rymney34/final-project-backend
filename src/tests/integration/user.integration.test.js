import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

import User from "../../models/user.js";
import app from "../appTest.js";
import db from './src/config/dbConnect.js'; 
var mongodb = process.env.ATLAS_URI_TEST 


describe("Authentication User Integration DB", () => {

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

    test("should create User", async () => {

        const newUser = {
            firstName: "Test",
            lastName: "Test12",
            email: "Test@gmail.com",
            password: "12345678",
            isAdmin: false,
        };

        const res = await request(app)
            .post("/api/register")
            .send(newUser)
            .expect(201);

        console.log("LOG ", res.body)
        expect(res.body).toMatchObject({
            firstName: "Test",
            email: "Test@gmail.com",
            isAdmin: false,
        });
        expect(res.body.firstName).toBe("Test");
    })
    //Test for login user
    test("should login User successfully", async () => {
        //filled fields pretending its from frontend ()
        const newUser = {
            firstName: "Test",
            lastName: "Test12",
            email: "test@gmail.com",
            password: "123456789",
            isAdmin: false,
        };

        //Register users for test Only
        await request(app)
            .post("/api/register")
            .send(newUser)
            .expect(201);
        // login user reqest
        const res = await request(app)
            .post("/api/login")
            .send({
                email: newUser.email,
                password: newUser.password,
            })
            .expect(200);

        console.log("LOGIN res:", res.body);
        //what should be returned by the method to pass the test
        //acctuly what expected from the test
        expect(res.body.message).toBe("Login successful");
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user.email).toBe(newUser.email);
    })

    //Test for Admin
    test("should return isAdmin true for admin user", async () => {

        const adminUser = {
            firstName: "Admin",
            lastName: "Admin2",
            email: "admin@test.com",
            password: "12345678",
            isAdmin: true,
        };
        //registrating Admin
        await request(app)
            .post("/api/register")
            .send(adminUser)
            .expect(201);

        //loginin admin
        const loginRes = await request(app)
            .post("/api/login")
            .send({
                email: adminUser.email,
                password: adminUser.password,
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        //Check if its acctuly Admin by cheking ifts true 
        const res = await request(app)
            .get("/api/isAdmin")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(res.body.isAdmin).toBe(true);
    });
})