import cookieParser from 'cookie-parser';
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRouter from './Routes/AuthRouter.js'
import connectDB from './Config/db.js';
import DocRouter from './Routes/DocRouter.js';

const app=express()
dotenv.config();

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.get('/',(req,res)=>{
    res.send('Welcome to the APP')
})

app.use('/api/auth', AuthRouter)
app.use('/api/docs', DocRouter)

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})