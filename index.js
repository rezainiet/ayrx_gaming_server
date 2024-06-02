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
import { app, server } from "./socket/socket.js";

// Ensure there are no trailing characters in the PORT environment variable
const PORT = parseInt(process.env.PORT, 10) || 4000;

const corsConfig = {
    origin: process.env.CLIENT_URL || 4000,
    credentials: true
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsConfig));

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
