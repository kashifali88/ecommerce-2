import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import cors from 'cors'
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();
const server = express();


// MIDDLEWARE PARSER
server.use(express.json());
server.use(cookieParser());
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true

}))


// API ROUTES
server.use('/api/auth', authRouter)
server.use('/api/user', userRouter)
server.use('/api/products', productRouter)
server.use('/api/cart', cartRouter)
server.use('/api/orders', orderRouter)



// MONGODB CONNECTION
const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Successfully connected to MongoDB");

        server.listen(PORT, () => {
            console.log(`Server is running on PORT:${PORT}`);
        });

    } catch (error) {
        console.log("MongoDB connection failed", error.message);
        process.exit(1)
    }
}


// ERROR MIDDLEWARE (ALWAYS LAST)
server.use((err, req, res, next) => {
const status = err.status || 500;
const message = err.message || "Internal server error";
res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
})
})


const PORT = process.env.PORT;
connect();