import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./socket/socket.js"

// const app = express();
const PORT = process.env.PORT || 4000;

const corsConfig = {
    origin: 'http://localhost:5173',
    credentials: true
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config({});
app.use(cors(corsConfig))


// Api's
app.use("/api/v1/user", userRoute);
// http://localhost:4000/api/v1/user/register
app.use("/api/v1/message", messageRoute);
// http://localhost:4000/api/v1/message


app.get('/', (req, res) => (res.send(`This app is running on port: ${PORT}`)));


server.listen(PORT, () => {
    connectDB();
    console.log(`App is running on http://localhost:${PORT}`)
});