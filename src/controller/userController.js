import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken, authenticateToken, verifyRefreshToken } from '../security/auth/jwtTokenProvider.js';
import {summariseHistory} from "../services/aiService.js"
import sanitize from 'mongo-sanitize';
import bcrypt from "bcryptjs";



    export const createUser = async (req, res) => {
        try {
            const firstName = sanitize(req.body.firstName);
            const lastName = sanitize(req.body.lastName);
            const email = sanitize(req.body.email);
            const password = sanitize(req.body.password);
            const isAdmin = req.body.isAdmin;

            if (!firstName || !email || !password || !lastName) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            if (
                typeof firstName !== "string" ||
                typeof email !== "string" ||
                typeof password !== "string" ||
                typeof lastName !== "string"
            ) {
                return res.status(400).json({ error: "Invalid input type" });
            }

            const existingUser = await User.findOne({email})
            if(existingUser){
                return res.status(400).json({message: "Email already Registered"})
            }

            const hashPass = await bcrypt.hash(password, 10);

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashPass,
                isAdmin,
            });

            await newUser.save();

            res.status(201).json({
                firstName: newUser.firstName,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            });
        } catch (err) {
            console.error("Error:", err);
            res.status(400).json({ error: err.message });
        }
    };

    

    export const loginUser = async (req, res) => {
        try {

            const email = sanitize(req.body.email)
            const password = sanitize(req.body.password)

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            console.log(refreshToken)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });

            res.json({
                message: 'Login successful',
                accessToken,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                }
            });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: err.message });
        }
    };

    export const getUser = async (req, res) => {

        try {

            const userId = req.user.sub;
            //exclude password
            const user = await User.findOne({ _id: userId }).select('-password');
            
            //check if user is empty 
            if (!user) {
                return res.status(400).json({ error: 'no user' });
            }

            
            res.json(user);
        } catch (err) {
            console.error("geting user error:", err);
            res.status(500).json({ error: err.message });
        }
    };

    export const putChatHistory = async (req, res, next) => {

        try {
            console.log("body ", req.body)

            const { userId, history } = req.body;
            // const {history } = req.body;
            console.log(userId, "userID")
            console.log(history, "user history")

            if (!history) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const userOnlyHistoryArray = history
                .filter(item => item.role === 'user')
                .map(item => item.parts[0].text)

            const userOnlyHistory = userOnlyHistoryArray.join(" ")

            console.log(userOnlyHistory, "user only  history")

            const summary = await summariseHistory(userOnlyHistory);

            console.log("Final Summary to save", summary)
                // const user = await User.findById(userId);
            
            if (userOnlyHistoryArray.length >= 2 && userId){
                
                console.log("Inside")
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {$addToSet: {chatSummary: summary}},
                    {new: true}
                )
                req.userSummary = updatedUser.chatSummary.join(", ");
            }
            next()
           

        } catch (err) {
            console.error("Error:", err);
            res.status(400).json({ error: err.message });
            next()
        }
};




    export const isAdminUser = async (req, res) => {
        try {
            const admin = req.user.isAdmin;
            res.json({ isAdmin: admin });
        } catch (err) { // FIXED: Added 'err' parameter
            console.error("isAdminUser error:", err);
            res.status(500).json({ error: err.message });
        }
    };

