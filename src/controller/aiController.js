import geminiService from '../services/aiService.js';

export const generateResponse = async (req, res) => {
    try {
        const {prompt} = req.body

        if(!prompt){
            return res.status(400).json({
                success: false,
                message: "Prompt is Required"
            })
        }

        const aiRes = await geminiService(prompt);

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

export const generateChat= async (req, res) => {
    try {
        const { prompt,files, history } = req.body

        console.log("eto file",files)

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is Required"
            })
        }

        const aiRes = await geminiService(prompt,files,history);

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

