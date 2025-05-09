const socket = require("socket.io");
const crypto = require('crypto')

const getSecretRoomId = (userId, targetedId) => {
    return crypto.createHash("sha256")
        .update([userId, targetedId].sort().join("_"))
        .digest("hex")
}

const initaializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
        
    });
    io.on("connection", (socket) => {
        //add event
        socket.on("joinChat", ({userId, targetedId, firstName}) => {
            const RoomId = getSecretRoomId(userId, targetedId);
            console.log(firstName + " join Romm :", RoomId);
            socket.join(RoomId);
        })

        socket.on("sendMessages", ({userId, targetedId, firstName, text}) => {
            const RoomId = getSecretRoomId(userId, targetedId);
            // console.log(firstName + " " + text)
            io.to(RoomId).emit("MessageReceived", {firstName, text})

        })

        socket.on("disconnect", () => {

        })
    })

}

module.exports = initaializeSocket;