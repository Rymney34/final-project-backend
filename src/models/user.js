import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean },
    chatSummary: {
        type: [String],
        default: ["This is a new user. No previous information is known."]
    }
    },
    {
        versionKey: false,
        collection: 'users'

    });

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;