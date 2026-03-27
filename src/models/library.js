import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    libraryTitle: { type: String, required: true },
    libraryDescription: { type: String, required: true },
    libraryImage: { type: String, required: true },
    libraryLink: { type: String, required: true, unique: true },
},
    {
        versionKey: false,
        collection: 'library'

    });

const libraryItem = mongoose.models.libraryItem || mongoose.model("library", librarySchema);

export default libraryItem;