
import { userModel } from "../models/userSchema.js"
import { userValidator } from "../validator/userInputValidator.js"
import {generateToken} from "../utils/generateToken.js";
import {loginValidator} from "../validator/loginValidator.js";
import bcrypt from "bcryptjs";
import {profileModel} from "../models/profileSchema.js";

export const getHome = (req, res) => {
    res.send('Hello world!')
}

export const getAbout = (req, res) => {
    res.send('About page')
    console.log('Testing')
}

export const createUser = async(req, res) => {
    try {
        const {name, email, password, bio, gender, age} = req.body

        if(name !== "" && email !== "" && password !== "" && gender !== "" && age !== "") {

            const {error} = userValidator.validate({
                name,
                email,
                password,
                bio,
                gender,
                age
            })

            if(error) {
                return res.status(400).json({
                    message: error.details[0].message,
                    error: true
                })
            }

            const existingUser = await userModel.findOne({email}).select('-password')

            if(existingUser) {
                return res.status(400).json({
                    message: 'User already exists, please log in.',
                    data: existingUser
                })
            }

            const profile = await profileModel.create({
                bio,
                age,
                gender,
                user: null
            })

            const newUser = await userModel.create({
                name,
                email,
                password,
                profile: profile._id
            })

            await profileModel.findByIdAndUpdate(profile._id, {user: newUser._id})

            const populatedUser = await userModel.findById(newUser._id).populate("profile")

            const token = await generateToken(newUser._id)

            res.cookie('genToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 7
            })

            return res.status(201).json({
                message: 'User created successfully!',
                data: populatedUser
            })
        }else{
            return res.status(400).json({
                message: "All fields are required!",
                error: true
            })
        }
    } catch (err) {
        if(err instanceof Error) {
            return res.status(500).json({
                message: err.message,
                error: err.error
            })
        }
    }
}

export const loginUser = async(req, res) => {
        try{
            const {email, password} = req.body
            if(email !== "" && password !== "") {
                const {error} = loginValidator.validate({email, password})
                if(error) return res.status(400).json({message: error.details[0].message})

                const userExists = await userModel.findOne({email})

                if(!userExists) return res.status(400).json({message: "User does not exist!"})

                const comparePassword = await bcrypt.compare(password, userExists.password, )

                if(comparePassword) {

                    const token = await generateToken(userExists._id)

                    res.cookie('genToken', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 1000 * 60 * 60 * 24 * 7
                    })

                    return res.status(200).json({
                        message: "Login successful!",
                        data: userExists
                    })
                }else{
                    return res.status(400).json({message: "Invalid credentials!"})
                }
            }else{
                return res.status(400).json({message: "All fields are required!"})
            }


        }catch(err){
        if(err instanceof Error) console.error(err.message)
        }
}

export const getUsers = async(req, res) => {
    try{
        const users = await userModel.find()

        if(!users) return res.status(404).json({message: "No users found!"})

        return res.status(200).json({message: "Users fetched successfully!", data: users})
    }catch(err){
        if(err instanceof Error) {
            return res.status(500).json({message: err.message})
        }
    }
}

export const deleteUser = async(req, res) => {
    const { id } = req.params

    if(!id) {
        return res.status(400).json({
            message: "User id is required!"
        })
    }

    const deletedUser = await userModel.findByIdAndDelete(id)

    if(!deletedUser) {
        return res.status(404).json({
            message: "User not found!"
        })
    }

    res.status(200).json({

        message: "User deleted successfully!",
        data: deletedUser
    })
}

export const logOut = async(req, res) => {
    try{
        res.clearCookie('genToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        res.status(200).json({message: "Logged out successfully!"})

    }catch(err){
    if(err instanceof Error) {
        console.error(err.message)
        res.status(err.code || 500).json({
            message: err.message
        })
        throw new Error(err.message)
    }
    }
}


