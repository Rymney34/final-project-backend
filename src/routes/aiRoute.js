import express from 'express';
const router = express.Router();
import { generateResponse, generateChat } from '../controller/aiController.js';
import { putChatHistory } from '../controller/userController.js'

router.post('/getAiResponse', generateResponse)

//using middleware putChatHistory - getting history of the previous chat from database
router.post('/getChat', putChatHistory, generateChat )


export default router;
