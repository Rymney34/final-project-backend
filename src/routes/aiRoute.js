import express from 'express';
const router = express.Router();
import { generateResponse, generateChat } from '../controller/aiController.js';


// Get all users


// Login user (without hashing passwords)
router.post('/getAiResponse', generateResponse)

router.post('/getChat', generateChat )


export default router;
