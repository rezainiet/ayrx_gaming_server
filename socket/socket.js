// socket.js

import express from "express";
import http from 'http';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);
});

export { app, server };
