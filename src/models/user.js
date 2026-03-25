import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean },

},
    {
        versionKey: false,
        collection: 'users'

    });

const User = mongoose.models.User || mongoose.model("users", UserSchema);

export default User;