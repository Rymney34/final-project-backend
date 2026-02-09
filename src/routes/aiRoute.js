const express = require('express');
const router = express.Router();
const { generateResponse, generateChat } = require('../controller/aiController');


// Get all users


// Login user (without hashing passwords)
router.post('/getAiResponse', generateResponse)

router.post('/getChat', generateChat )


module.exports = router;
