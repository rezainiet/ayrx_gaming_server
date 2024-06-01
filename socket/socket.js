// socket.js

import express from "express";
import http from 'http';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['https://onlyhumanity.co.uk', 'http://localhost:5173', 'http://192.168.0.108:5173'],
        methods: ['GET', 'POST']
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    const userId = socket.handshake.query.userId;
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
        io.emit('userActive', userId);  // Emit user active event
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });

    socket.on('userActive', (userId) => {
        io.emit('userActive', userId);  // Handle user active event
    });
});

export { app, server, io };
