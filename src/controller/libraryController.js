import libraryItem from "../models/library.js";

export const getLibraries = async (req, res) => {

    try {
        // query to bakedn
        const projection = [
            {
                $match: {}
            },
            {
                $project: {
                    _id: 0,
                    libraryTitle: 1,
                    libraryDescription: 1,
                    libraryImage: 1,
                    libraryLink: 1
                }
            }
        ];
        //actual call to db
        const result = await libraryItem.aggregate(projection);
        //404 error 
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No Library are found in the DB",
            })
        }

        return res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        throw error
    }
}
