import mongoose from "mongoose";
import connect from "../config/dbConnect.js";

// model for museum
const museumScheme = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "user",
    //     required: true,
    // },
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
    video: { type: String, required: true },
    virtualTours: [
        {
            tour: {
                type: String,
                required: true,
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
// bookingSchema.index({ 
//   serviceTitle: "text",
//   secondName: "text",
//   postCode: "text",
//   address: "text", 
// });

const museumsModel=
    mongoose.models.museums ||
    mongoose.model("museums", museumScheme);

export default museumsModel;