import { describe, it, expect, vi, beforeEach } from 'vitest';
import generateChat, { generateResponseAi, summariseHistory } from '../../services/aiService.js';

// gemini mock 
vi.mock('@google/genai', () => {
    const textMock = vi.fn().mockReturnValue("Mocked AI Response");

    const generateContentMock = vi.fn().mockResolvedValue({
        text: "Mocked AI Response"
    });

    const sendMessageMock = vi.fn().mockResolvedValue({
        text: "Mocked Chat Response"
    });

    const createChatMock = vi.fn().mockResolvedValue({
        sendMessage: sendMessageMock
    });

    return {
        GoogleGenAI: vi.fn().mockImplementation(() => ({
            models: {
                generateContent: generateContentMock
            },
            chats: {
                create: createChatMock
            }
        })),
        _internalMocks: {
            generateContentMock,
            createChatMock,
            sendMessageMock
        }
    };
});

// AI service logic test 
describe('AI Service Logic Tests', () => {
    let mocks;
    //clears tests 
    beforeEach(async () => {
        const mod = await import('@google/genai');
        mocks = mod._internalMocks;
        vi.clearAllMocks();
    });
    //summarise hostry test 
    describe('summariseHistory', () => {
        it('should send the correct formatting prompt to AI', async () => {
            const history = "User said they like art.";
            await summariseHistory(history);

            expect(mocks.generateContentMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    model: "gemini-2.5-flash-lite",
                    contents: expect.stringContaining("Extract user traits")
                })
            );
        });
    });
    //generating chat test 
    describe('generateChat', () => {
        it('should include user persona in system instructions', async () => {
            const prompt = "Hello";
            const summary = "User is a teacher";
            const history = [];

            await generateChat(prompt, [], history, summary);

            expect(mocks.createChatMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    config: expect.objectContaining({
                        systemInstruction: expect.stringContaining("User Profile User is a teacher")
                    })
                })
            );

            expect(mocks.sendMessageMock).toHaveBeenCalled();
        });

        it('should handle errors and throw a custom message', async () => {
            mocks.createChatMock.mockRejectedValue(new Error("Network Fail"));

            await expect(generateChat("Hi")).rejects.toThrow("Failed to communicate with AI");
        });
    });
});