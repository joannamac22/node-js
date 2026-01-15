
import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async() => {
 if(isConnected) {
    console.log('Database is already connected')
    return;
 }

 try{
    const db = await mongoose.connect(process.env.MONGO_URI)
    isConnected = db.connections[0].readyState
    console.log('Database connected successfully')
 }catch(err){
    if(err instanceof Error){
        console.error(err.message)
    }
 }
}