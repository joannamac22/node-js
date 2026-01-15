
import jwt from 'jsonwebtoken';
import {userModel} from "../models/userSchema.js";
import dotenv from "dotenv";
dotenv.config()

const secret = process.env.JWT_SECRET

console.log(secret)

export const protect = async(req, res, next) => {
    try{
        const token = req.cookies.genToken

        if(!token) {
            return res.status(401).json({message: 'Access denied!'})
        }

        const verified = jwt.verify(token, secret)

        req.user = await userModel.findById(verified.id).select('-password')

        if(!req.user) {
            return res.status(401).json({message: 'User no longer exists!'})
        }

        next()
    }catch (err){
        if(err instanceof Error) throw new Error(err.message)
    }
}