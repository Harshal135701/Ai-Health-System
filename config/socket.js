const { Server } = require("socket.io");

let io;

function initializeSocket(server) {

    io = new Server(server);

    io.on("connection", (socket) => {

        // console.log(" User Connected :", socket.id);

        // Join Room
        socket.on("joinRoom", ({ userId, role }) => {

            const roomName = `${role}_${userId}`;

            socket.join(roomName);

            // console.log(`${socket.id} joined ${roomName}`);
            io.to(roomName).emit("roomJoined", {

                message: `Welcome to ${roomName}`

            });
        });

        socket.on("disconnect", () => {

            // console.log("❌ User Disconnected :", socket.id);

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