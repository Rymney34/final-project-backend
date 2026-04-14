import mongoose from "mongoose";
import connect from "../config/dbConnect.js";

// model for museum
const museumScheme = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstPageImage: { type: String, required: true },
    museumTitle: { type: String, required: true },
    openingTime: { type: String, required: true },
    contactInfo: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    accessiblityInfo: { type: String, required: true },
    location: { type: String, required: true },
    map3d: { type: String, required: true },
    slider: [
        {
        slideTitle:{
            type:String,
            
        },
        slideDescription:{
            type:String,
            
        },
        slideImage:{
            type: String,
            
        }
        }
    ],
    video: { type: String},
    virtualTours: [
        {
            tour: {
                type: String,
            },
            
        }
    ],
    map: { type: String, required: true },
},
    {
        versionKey: false,
        collection: 'museums'
    });
museumScheme.index(
    { museumTitle: 1 },
    { unique: true }
)

const museumsModel=
    mongoose.models.museums ||
    mongoose.model("museums", museumScheme);

export default museumsModel;