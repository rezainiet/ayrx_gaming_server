import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import postRoute from "./routes/postRoute.js"
import gameRoute from "./routes/gameRoute.js"
import groupRoute from "./routes/groupRoute.js"
import commentRoute from "./routes/commentRoute.js"
import paymentRoute from "./routes/paymentRoute.js"
import appointmentRoute from "./routes/appointmentRoute.js"
import bookingRoute from "./routes/bookingRoute.js"
import forumPostRoute from "./routes/forumPostRoute.js"
import forumCommentRoutes from "./routes/forumCommentRoutes.js"
import forumReplyRoutes from "./routes/forumReplyRoutes.js"
import { app, server } from "./socket/socket.js"

// const app = express();
const PORT = process.env.PORT || 4000;

const corsConfig = {
    origin: process.env.CLIENT_URL, // use environment variable for flexibility
    credentials: true
};

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
app.use("/api/v1/posts", postRoute);
// http://localhost:4000/api/v1/posts
app.use("/api/v1/games", gameRoute);
// http://localhost:4000/api/v1/games
app.use("/api/v1/groups", groupRoute);
app.use("/api/v1/comment", commentRoute);
// http://localhost:4000/api/v1/comment

app.use("/api/v1/payment", paymentRoute);
// http://localhost:4000/api/v1/payment

// http://localhost:4000/api/v1/booking
app.use("/api/v1/booking", bookingRoute);


// http://localhost:4000/api/v1/appointment
app.use("/api/v1/appointment", appointmentRoute);

app.use('/api/forumPosts', forumPostRoute);
app.use('/api/forumComments', forumCommentRoutes);
app.use('/api/forumReplies', forumReplyRoutes);


app.get('/', (req, res) => (res.send(`This app is running on port: ${PORT}`)));


server.listen(PORT, () => {
    connectDB();
    console.log(`Hey people! App is running on http://localhost:${PORT}`)
});