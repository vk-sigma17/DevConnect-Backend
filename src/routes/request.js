const express = require('express');
const requestRouter = express();

const User = require('../models/user')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid Status Type: " + status });
        }
        

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({
                message: "User Not Found!!"
            })
        }

        // If there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId:fromUserId}
            ]
            
        })
        if(existingConnectionRequest){
            return res.status(400).send({message : "Connection Request Alreadt Exist!!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()
        res.json({
            message: "connection Request Sent Successfully!",
            data,
        })
    }
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
    
})

module.exports = requestRouter;