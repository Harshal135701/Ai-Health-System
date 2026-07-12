const { Server } = require("socket.io");
const Message = require("../models/message");

let io;

function initializeSocket(server) {

    io = new Server(server);

    io.on("connection", (socket) => {
        socket.on("joinRoom", ({ userId, role }) => {

            const roomName = `${role}_${userId}`;

            socket.join(roomName);

            // console.log(`${socket.id} joined ${roomName}`);
            io.to(roomName).emit("roomJoined", {

                message: `Welcome to ${roomName}`

            });
        });

        socket.on("joinConversation", ({ conversationId }) => {

            const roomName = `conversation_${conversationId}`;

            socket.join(roomName);

            console.log(`${socket.id} joined ${roomName}`);

        });

        socket.on("sendMessage", async (data) => {
            try {

                const {
                    conversationId,
                    sender,
                    text
                } = data;

                const message = await Message.create({
                    conversationId,
                    sender,
                    text
                });

                const populatedMessage = await Message.findById(message._id)
                    .populate("sender", "name role profilePic");

                io.to(`conversation_${conversationId}`)
                    .emit("receiveMessage", populatedMessage);

            } catch (err) {
                console.log(err);
            }
        });

        socket.on("disconnect", () => {

        });

    });

}

function getIO() {

    if (!io) {
        throw new Error("Socket.IO is not initialized.");
    }

    return io;

}

module.exports = {
    initializeSocket,
    getIO
};