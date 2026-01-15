

import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }
}, {timestamps: true})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next()

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
})

export const userModel = mongoose.model("User", userSchema)