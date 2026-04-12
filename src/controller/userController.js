import bcrypt from "bcryptjs";
import sanitize from 'mongo-sanitize';
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from '../security/auth/jwtTokenProvider.js';
import { summariseHistory } from "../services/aiService.js";
//creating user 
    export const createUser = async (req, res) => {
        try {
            //cleaning received data so is protecting db and sever 
            const firstName = sanitize(req.body.firstName);
            const lastName = sanitize(req.body.lastName);
            const email = sanitize(req.body.email);
            const password = sanitize(req.body.password);
            const isAdmin = req.body.isAdmin;
            //in case empty data recieved
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
            //query to db to check if user exist 
            const existingUser = await User.findOne({email})
            if(existingUser){
                return res.status(400).json({message: "Email already Registered"})
            }
            //decrypt password
            const hashPass = await bcrypt.hash(password, 10);
            //creating, passing actual data to db
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashPass,
                isAdmin,
            });
            //saving it to db
            await newUser.save();
            //returning it to db
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
    //login user 
    export const loginUser = async (req, res) => {
        try {
            //protection 
            const email = sanitize(req.body.email)
            const password = sanitize(req.body.password)
            //find user based on input by user
            const user = await User.findOne({ email });
            //in case something is wrong with user details 
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            //try to match data with sent data
            const isMatch = await bcrypt.compare(password, user.password);
            //validation
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            //tokens 
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            console.log(refreshToken)
            //put data into cookies 
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });
            //returning to database
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
    //getting user and its details
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
    // recive and put chat history to db 
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
            //putting srting 'users' data in to Array 
            const userOnlyHistoryArray = history
                .filter(item => item.role === 'user')
                .map(item => item.parts[0].text)
            //then get it from array and join each node together in one single line
            const userOnlyHistory = userOnlyHistoryArray.join(" ")

            console.log(userOnlyHistory, "user only  history")

            //calling function for summarizing 
            const summary = await summariseHistory(userOnlyHistory);
            // if users id is there and userHistory is leng more or equal to 2 it will save data to db
            if (userOnlyHistoryArray.length >= 2 && userId){
                //query to DB
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {$addToSet: {chatSummary: summary}},
                    {new: true}
                )
                req.userSummary = updatedUser.chatSummary.join(", ");
            }
            //moving to the next function
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

