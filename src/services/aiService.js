const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');

const path = require('path');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,

});
// Reading of txt file with insturcitons AI insrutctions
function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath);
        return data.toString();
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}
//Declaring var with file fucntion that is readaing and returning string with all instructions 
const adventOfCodeInput = readFile(path.join(__dirname, 'inst.txt'));

// console.log(adventOfCodeInput)

//calling Gemini AI API and passing props fro client 
const generateResponseAi = async (userPrompt) => {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    // const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: userPrompt,
            config: {
                systemInstruction: `use this information, keep it mind or reference 
                where applicable to response to each prompt  ${adventOfCodeInput}`,
            },
            
        });
       
        console.log(response.text);
        return response.text
    }
    catch(error){
        console.error("Gemini Service Error:", error);
        throw new Error("Failed to communicate with AI");
    }
}

//calling Gemini AI API and passing props from client to start chat
const generateChat = async (userPrompt, incHistory = []) => {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
   
    const generationConfig = {
        temperature: 0.3,
        topK: 1,
        topP: 1,
        maxOutputTokens: 300,
    };

    try {
        const chat = await ai.chats.create({
            generationConfig,
            model: "gemini-2.5-flash-lite",
            config: {
                systemInstruction: `use this information, keep it mind or reference 
                where applicable to response to each prompt  ${adventOfCodeInput}`,
            },
            history : incHistory

        });

        const result = await chat.sendMessage({message: userPrompt});
        // const response = result.response;
        console.log(result.text)
        return result.text;
      

        // console.log(response1.text);
        // return response1.text
    }
    catch (error) {
        console.error("Gemini Service Error:", error);
        throw new Error("Failed to communicate with AI");
    }
}




module.exports = {generateResponseAi, generateChat}

