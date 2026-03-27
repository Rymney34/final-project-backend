import Event from "../models/event.js";

export const getEvents= async (req, res) => {

    try {
        // query to bakedn
        const projection = [
            {
                $match: {}
            },
            {
                $project: {
                    _id: 0,
                    eventTitle: 1,
                    eventDate: 1,
                    eventImage: 1,
                    eventLink: 1
                }
            }
        ];
        //actual call to db
        const result = await Event.aggregate(projection);
        //404 error 
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No Events are found in the DB",
            })
        }

        return res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        throw error
    }
}
