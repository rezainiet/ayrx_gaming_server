import dotenv from 'dotenv';
dotenv.config(); // Load environment variables at the very beginning

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import postRoute from "./routes/postRoute.js";
import gameRoute from "./routes/gameRoute.js";
import groupRoute from "./routes/groupRoute.js";
import commentRoute from "./routes/commentRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import forumPostRoute from "./routes/forumPostRoute.js";
import forumCommentRoutes from "./routes/forumCommentRoutes.js";
import forumReplyRoutes from "./routes/forumReplyRoutes.js";
// import app and server from socket.js
import { app, server } from "./socket/socket.js";


const PORT = parseInt(process.env.PORT, 10) || 4000;

const allowedOrigins = [
    'https://www.onlyhumanity.co.uk', 'http://localhost:5173', 'http://localhost:8080',
    'https://www.admin.onlyhumanity.co.uk'
];

const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware to log requests and cookies (for debugging)
// app.use((req, res, next) => {
//     console.log(`Request URL: ${req.url}`);
//     console.log(`Request Cookies: ${JSON.stringify(req.cookies)}`);
//     next();
// });

// Connect to database
connectDB();

// Api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/games", gameRoute);
app.use("/api/v1/groups", groupRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/appointment", appointmentRoute);
app.use('/api/forumPosts', forumPostRoute);
app.use('/api/forumComments', forumCommentRoutes);
app.use('/api/forumReplies', forumReplyRoutes);

app.get('/', (req, res) => res.send(`This app is running on port: ${PORT}`));

// Handle server errors
server.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Hey people! App is running on http://localhost:${PORT}`);
    }
});
