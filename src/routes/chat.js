const express = require('express');
const { Chat } = require('../models/chats');
const { userAuth } = require('../middlewares/auth');
const { path } = require('./request');
const chatRouter = express.Router();

chatRouter.get("/chat/:targetedId", userAuth, async(req, res) => {
    const { targetedId } = req.params;
    const userId = req.user._id;

    try{
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetedId]},
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });
        if(!chat){
            chat = new Chat({
                participants: [userId, targetedId],
                messages: [],
            });
            await chat.save()
        }
        res.json(chat)
    }
    catch(err){
        console.log(err)
    }
})




module.exports = chatRouter;