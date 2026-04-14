import jwt from 'jsonwebtoken'
import express from 'express';


    
    const JWT_Token = process.env.ACCESS_TOKEN_SECRET || "super_secret_test_key_123";
    const ACCESS_Token_Expires = '10min';
    const REFRESH_Token = process.env.REFRESH_TOKEN;
    const REFRESH_Token_Expires = "1d"
    // generatingAccessToken function
    export const generateAccessToken = (user) => {
        const payload = {
            sub: user.id || user.sub || user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin ,
        }

        return jwt.sign(
            payload, JWT_Token, {
                expiresIn: ACCESS_Token_Expires
            }
        )
    }
    // generating Refresh token method passing expiring data 
    export const generateRefreshToken = (user) => {
        const payload = {
            sub: user.id || user.sub || user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
        }
        console.log("Cretead Token Cookie")
        return jwt.sign(
            payload, REFRESH_Token,
            {expiresIn:REFRESH_Token_Expires}
        )
    }
    // verifying the token that is not fake, cheking if same secret numbers
    export const verifyRefreshToken = (token) => {
        try {
            const userPayload = jwt.verify(token, REFRESH_Token);
           
            return userPayload; 
        } catch (err) {
            // Token is invalid or expired
            console.error("Refressh Token Verification Error", err.Message)
            return null; 
        }
    }

    export const verifyDecodeToken = (req, res, next) =>{
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) return res.status(401).json({ message: 'No token Provided' })
            //verify token and return user based on the token 
            jwt.verify(token, JWT_Token, async (err, decoded) => {
                if (err) return res.status(403).json({ message: "Invalid or expired token" });
                req.user = decoded
                
                next()
            })
        } catch (err) {
            // Token is invalid or expired
            console.error("Refressh Token Verification Error", err.Message)
            return null;
        }
        
    }

    // verification of the access token 
    export const authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        // console.log("acutal "+token)
        if (!token ) {
            return res.status(401).json({data:[], message: 'Token missing' });
        }
  // verification if the token is the proper token
        jwt.verify(token, JWT_Token, (err, user) => {
            if (err) {
                return res.status(403).json({ data:[],message: 'Invalid or expired token' });
            }
            req.user = user; 
            next();
        });
    }

