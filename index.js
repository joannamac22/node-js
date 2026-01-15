
import express from 'express'
import userRouter from './routes/userRotes.js'
import { connectDB } from './config/dbConnect.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
await connectDB()

app.use(userRouter)


if(process.env.NODE_ENV !== "production") {
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`)
})
}

export default app;
