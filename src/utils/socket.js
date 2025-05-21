const socket = require("socket.io");
const crypto = require('crypto');
const { Chat } = require("../models/chats");

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

        socket.on("sendMessages", async({userId, targetedId, firstName, lastName, text}) => {
            
            try{
                const RoomId = getSecretRoomId(userId, targetedId);
                // Save the messages in DB
                let chat =  await Chat.findOne({
                    participants: {$all:[userId, targetedId]},
                })
                // create a New Chat
                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetedId],
                        messages: []
                    })
                }
                // if already exist push this new msg to it
                chat.messages.push({
                    senderId: userId,
                     text,
                    });
                 await chat.save();
                io.to(RoomId).emit("MessageReceived", {firstName, lastName, text})
                
            }
            catch(err){
                console.log(err)
            }

        })

        socket.on("disconnect", () => {

        })
    })

}

module.exports = initaializeSocket;