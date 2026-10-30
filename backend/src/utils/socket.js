const { Server } = require('socket.io')
const Chat = require("../model/chat")
const cookieParser = require('cookie-parser')
const socketAuth = require('./socketAuth')
const canChat = require('./chatAccess')

const initializeSocket = (server) => {
    console.log("Initialized....")

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    })


    io.engine.use(cookieParser())
    io.use(socketAuth)

    io.on("connection", (socket) => {
        const userId = socket.data._id
        const firstName = socket.data.firstName

        socket.on("joinChat", async ({ targetUserId }) => {
            try {
                if (!(await canChat(userId, targetUserId))) {
                    return socket.emit("chatError", { message: "Chat not allowed" });
                }
                const roomId = [userId, targetUserId].sort().join("_")
                socket.join(roomId)
                // console.log(roomId)
            }
            catch(err){
                console.log(err.message)
            }


        })

        socket.on("sendMessage", async ({ targetUserId, text }) => {
            try {
                const cleanText = typeof text === "string" ? text.trim() : "";
                if (!cleanText || !(await canChat(userId, targetUserId))) {
                    return socket.emit("chatError", { message: "Message not allowed" });
                }
                const roomId = [userId, targetUserId].sort().join("_")

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId], messages: []
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text: cleanText
                })
                await chat.save()
                io.to(roomId).emit("messageReceived", { firstName, text, senderId: userId })
            }
            catch (err) {
                console.log(err.message)
            }
        })
    })
}

module.exports = initializeSocket