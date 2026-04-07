import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

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

//calling Gemini AI API and passing props from client 
export const generateResponseAi = async (userPrompt, files=[]) => {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    // const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
    console.log('Insight');
    try{
        const parts = [];

        if(userPrompt){
            parts.push({text: userPrompt});
        }

        for (const file of files){
            parts.push({
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.base64
                }
            })
        }

        console.log("this is parts", parts)
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents:[
                {
                    role: "user",
                    parts: parts
                }
            ],
            //giving instructions from txt file
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
const generateChat = async (userPrompt, files = [], incHistory = []) => {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    console.log('generate chat');
    const generationConfig = {
        temperature: 0.3,
        topK: 1,
        topP: 1,
        maxOutputTokens: 300,
    };

    const parts = [];
    //just text no file
    if (userPrompt) {
        parts.push({ text: userPrompt });
    }
    //file pushing into array 
    for (const file of files) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType,
                data: file.base64
            }
        })
    }

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

        const result = await chat.sendMessage({message: parts});
        // const response = result.response;
        return result.text;
      

        // console.log(response1.text);
        // return response1.text
    }
    catch (error) {
        console.error("Gemini Service Error:", error);
        throw new Error("Failed to communicate with AI");
    }
}


export default generateChat


