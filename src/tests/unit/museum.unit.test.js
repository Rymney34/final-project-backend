// Unit testing 
import { createMuseum, uploadMiddleware, setMuseumPic, getMuseum, getEachMuseum, setMuseumVideo, setMuseumPic, } from '../../controller/museumController.js';
import { describe, test, vi, it, expect, beforeEach } from "vitest"
import Museums from "../../models/museum.js";

//mock model initialisation
vi.mock("../../models/museum.js");

//For res imitation what Express returns (method chining) - template in simple words
function mockResponse() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
    }
}
//mocking AWS s3 backet
vi.mock("@aws-sdk/client-s3", () => {
    return {
        S3Client: vi.fn(() => ({
            send: vi.fn().mockResolvedValue({
                $metadata: { httpStatusCode: 200 }
            })
        })),
        PutObjectCommand: vi.fn()
    };
});
const s3SendMock = vi.fn();

//test related to Booking creation 
describe("Museums Module - Unit Test", () => {
    //clears tests 
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.S3_BUCKET_REGION = "eu-north-1";
        s3SendMock.mockResolvedValue({
            $metadata: { httpStatusCode: 200 }
        });
    });
// shoud return error 400 in case in craete musum files are empty
    test("should return 400 if required fields are missing", async () => {
        //req tha should come from frontend just imitation
        const req = {
            body: { firstPageImage: "Cardiff Museum" },
        };
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse();
        //calling function from controller 
        await createMuseum(req, res);
        //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
    });
// Creation of museum test
    test("should create a museum successfully with all valid fields", async () => {
        const testMuseumData = {
            firstPageImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png",
            museumTitle: "The Grand Gallery of Art",
            openingTime: "09:00 - 18:00",
            contactInfo: "+44 123 456 789",
            accessiblityInfo: "Wheelchair accessible, elevators available on all floors.",
            location: "123 Museum Way, London",
            map3d: "51.485496, -3.176719",
            map: "51.485852416749516, -3.177821578",
            slider: [
                {
                    slideTitle: "Renaissance Hall",
                    slideDescription: "A collection of 15th-century masterpieces.",
                    slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                },
                {
                    slideTitle: "Modern Exhibit",
                    slideDescription: "Exploring digital art in the 21st century.",
                    slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                }
            ],
            video: "https://www.youtube.com/watch?v=XQw2r6jJ6sE&t=2s",
            virtualTours: [
                {
                    tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                },
                {
                    tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                }
            ]
        };

        const req = {
            body: testMuseumData
        };
        const res = mockResponse();

        await createMuseum(req, res);

        expect(Museums).toHaveBeenCalledWith(expect.objectContaining({
            museumTitle: testMuseumData.museumTitle,
            location: testMuseumData.location
        }));

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            message: "Good job, Museum is submitted/added"
        }));
    });
    //should handle database errors 
    test("should handle database errors gracefully during museum creation", async () => {

        Museums.mockImplementationOnce(() => ({
            save: vi.fn().mockRejectedValue(new Error("Database Failure"))
        }));
        // Museums.create.mockRejectedValue(new Error("Database Failure"))

        const req = {
            body: {
                museumTitle: "Fail Museum",
                firstPageImage: "someimage",
                // other required fields ...
            }
        };
        const res = mockResponse();

        await createMuseum(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: "Server error",
            error: 'Database Failure'
            
        }));
    });
    // get unit museum test 
    test("should read (get) museums successfuly", async () => {
        //req tha should come from frontend just immitation
        const req = {
            query: { page: 1, limit: 2 },
        }
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse()
        //imitation of the database or  what be returned from database 
        const mockMuseums = [
            {
                _id: "mus1",
                firstPageImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png",
                museumTitle: "The Grand Gallery of Art",
                location: "123 Museum Way, London"
            }, {
                _id: "mus2",
                firstPageImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png",
                museumTitle: "Cardiff Gallery",
                location: "123 Museum Way, London"
            }
        ];
        //finding museums
        Museums.aggregate.mockReturnValue(mockMuseums);
        //calling function 
        await getMuseum(req, res)
        //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            result: mockMuseums,
            hasMore: false
        })
    });
    // unit test should return 404 in case musueum is not found
    test("should return 404 if aggregate returns null or undefined", async () => {
        const req = { query: {} };
        const res = mockResponse();

        Museums.aggregate.mockResolvedValue(null);

        await getMuseum(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "No museums are found in the DB"
        });
    });

    //should return musueum test 
    test("should (get) each museums successfuly", async () => {
        const validId = "6938b350de5d0c0e10c7d531";
        //req tha should come from frontend just immitation

        const req = {
            params: {id: validId}
        }
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse()
        //imitation of the database or  what be returned from database 
        const mockMuseums = [
            {   
                _id: validId,
                firstPageImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png",
                museumTitle: "The Grand Gallery of Art",
                openingTime: "09:00 - 18:00",
                contactInfo: "+44 123 456 789",
                accessiblityInfo: "Wheelchair accessible, elevators available on all floors.",
                location: "123 Museum Way, London",
                map3d: "51.485496, -3.176719",
                map: "51.485852416749516, -3.177821578",
                slider: [
                    {
                        slideTitle: "Renaissance Hall",
                        slideDescription: "A collection of 15th-century masterpieces.",
                        slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                    },
                    {
                        slideTitle: "Modern Exhibit",
                        slideDescription: "Exploring digital art in the 21st century.",
                        slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                    }
                ],
                video: "https://www.youtube.com/watch?v=XQw2r6jJ6sE&t=2s",
                virtualTours: [
                    {
                        tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                    },
                    {
                        tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                    }
                ]
            }, {
                _id: "6938b350de5d0c0e10c7d532",
                firstPageImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png",
                museumTitle: "Cardiff Gallery",
                openingTime: "09:00 - 18:00",
                contactInfo: "+44 123 456 789",
                accessiblityInfo: "Wheelchair accessible, elevators available on all floors.",
                location: "123 Museum Way, London",
                map3d: "51.485496, -3.176719",
                map: "51.485852416749516, -3.177821578",
                slider: [
                    {
                        slideTitle: "Renaissance Hall",
                        slideDescription: "A collection of 15th-century masterpieces.",
                        slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                    },
                    {
                        slideTitle: "Modern Exhibit",
                        slideDescription: "Exploring digital art in the 21st century.",
                        slideImage: "https://museums-welsh-heritage-bucket.s3.eu-north-1.amazonaws.com/museum-content/image-1775070689146-Screenshot 2026-04-01 at 20.11.18.png"
                    }
                ],
                video: "https://www.youtube.com/watch?v=XQw2r6jJ6sE&t=2s",
                virtualTours: [
                    {
                        tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                    },
                    {
                        tour: "https://my.matterport.com/show?play=1&lang=en-US&m=5iv3CpmALFy"
                    }
                ]
            }
        ];
        //finding museums
        Museums.find.mockReturnValue({
            skip: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue(mockMuseums)
            })
        });

        Museums.findById.mockResolvedValue(mockMuseums)
        //calling function 
        await getEachMuseum(req, res)
        //acctual test expections and what acctualy received
        expect(Museums.findById).toHaveBeenCalledWith(validId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockMuseums)
    });

    // AWS S3 backet test
    describe("AWS S3 Uploads (setMuseumPic & setMuseumVideo)", () => {
        // test that museum picture will be added to AWS S3
        test("should upload a museum picture successfully", async () => {
            const req = {
                files: {
                    firstPageImage: [{
                        originalname: "test-image.jpg",
                        buffer: Buffer.from("fake-image-data")
                    }]
                }
            };
            const res = mockResponse();

            await setMuseumPic(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                url: expect.stringContaining("amazonaws.com/museum-content/image-"),
                key: expect.stringContaining("test-image.jpg")
            }));
        });
        // test that vidoe will be uploaded to aws
        test("should upload a museum video successfully", async () => {
            const req = {
                file: {
                    originalname: "test-video.mp4",
                    buffer: Buffer.from("fake-video-data")
                }
            };
            const res = mockResponse();

            await setMuseumVideo(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                url: expect.stringContaining("video-"),
                key: expect.stringContaining("test-video.mp4")
            }));
        });
        
    });
})