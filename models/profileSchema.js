
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    bio: {
        type: String,
        required: false
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
    }
)

export const profileModel = mongoose.model("Profile", profileSchema)