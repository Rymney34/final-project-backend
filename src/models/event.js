import mongoose from "mongoose";

const EventsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    eventTitle: { type: String, required: true },
    eventImage: { type: String, required: true },
    eventDate: { type: String, required: true },
    eventLink: { type: String, required: true },
},
    {
        versionKey: false,
        collection: 'events'

    });

const Event = mongoose.models.Event || mongoose.model("events", EventsSchema);

export default Event;