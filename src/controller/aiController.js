const geminiService = require('../services/aiService.js');

const generateResponse = async (req, res) => {
    try {
        const {prompt} = req.body

        if(!prompt){
            return res.status(400).json({
                success: false,
                message: "Prompt is Required"
            })
        }

        const aiRes = await geminiService.generateResponseAi(prompt);


        return res.status(200).json({
            success: true,
            data: aiRes
        })

    }
    catch(error){
        console.error("Error in Aicontoller:", error.message);
    
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: AI could not process - 500"
        })
    }
}


const generateChat= async (req, res) => {
    try {
        const { prompt, history} = req.body

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is Required"
            })
        }

        const aiRes = await geminiService.generateChat(prompt,history);


        return res.status(200).json({
            success: true,
            data: aiRes,
        })

    }
    catch (error) {
        console.error("Error in Aicontoller:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error: AI could not process - 500"
        })
    }
}


module.exports = {
    generateResponse,
    generateChat
};