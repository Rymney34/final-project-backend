
import express from 'express';
const router = express.Router();
import { loginUser, createUser, isAdminUser } from '../controller/userController.js';
import { validate, refreshFunc, logout } from "../controller/authController.js";
// import JWT from '../security/auth/jwtTokenProvider';
import {authenticateToken} from "../security/auth/jwtTokenProvider.js";

// Get all users
// router.get('/users', getUsers);

router.post('/register', createUser)
router.post('/login', loginUser);

router.get('/auth/validate', validate);

router.post('/refresh', refreshFunc);

router.post('/logout', logout);

router.get('/isAdmin', authenticateToken, isAdminUser)

export default router;