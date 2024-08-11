import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'

import users from './routes/user.js'
import { chatDb, messageDb } from './database/db.js'

export const app = express()

app.use(express.json())
app.use(cors())

const server = app.listen(8080, () => {
    console.log(`Server is Running on port 8080`)
})

const s = new Server(server);
const io = s.of('/');
const userSockets = new Map();

io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on("user-join", (data) => {
        userSockets.set(data, socket.id);
        io.to(socket.id).emit('session-join', 'Your session has been Started');
    })

    socket.on("disconnect", () => {
        for (let [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                break;
            }
        }
    })

    socket.on("newMessage", async (message) => {
        console.log(message);
        var result;
        if (message.chatId) {
            result = await messageDb.createMessage({
                chatId: message.chatId,
                message: message.msg
            });
        } else {
            result = await chatDb.createChat({
                senderUserId: message.senderUserId,
                receiverUserId: message.receiverUserId,
                message: [{
                    chatId: message.chatId,
                    message: message.msg
                }]
            });
        }
        console.log(result);

        io.to(socket.id).emit("newMessage", { ...message, date: new Date(), id: Math.floor(Math.random() * Math.pow(10, 7)) });
    });
    socket.on("deleteMsg", (id) => {
        console.log(id);
        io.emit("deleteMsg", id);
    });


});

app.use("/api/auth", users)

app.post("/api/message", async (req, res) => {
    const { chatId, msg, senderUserId, receiverUserId } = req.body;
    const socketId = userSockets.get('kia');
    if (socketId) {
        io.to(socketId).emit("newMessage", { chatId, msg, senderUserId, receiverUserId });
        return res.status(200).json({ message: 'message Add' });
    } else {
        return res.status(400).json({ message: 'No Active session found!' });
    }
})

