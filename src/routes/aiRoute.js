import express from 'express';
const router = express.Router();
import { generateResponse, generateChat } from '../controller/aiController.js';
import { putChatHistory } from '../controller/userController.js'


// Get all users


// Login user (without hashing passwords)
router.post('/getAiResponse', generateResponse)

router.post('/getChat', putChatHistory, generateChat )


export default router;
