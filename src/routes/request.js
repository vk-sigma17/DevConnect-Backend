const express = require('express');
const requestRouter = express();

const User = require('../models/user')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require("../models/connectionRequest")

// To send connction request
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
            // message: "connection Request Sent Successfully!",
            message: `${req.user.firstName} ${status === "interested" ? "interested in" : "ignored"} ${toUser.firstName}`,
            data,
        })
    }
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
    
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req, res) => {
    try{

        const loggedInUser = req.user;
        const {status, requestId} = req.params;
    
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid Status Or Status Not Allowed",
                success: false
            })
        }
    
        const connctionReq = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        // conso le.log("ABC", connctionReq)
        if(!connctionReq){
            return res.status(404).json({
                message: "Connection Request Not Found",
                success: false
            })
        }
        connctionReq.status = status;
        const data = await connctionReq.save();

        return res.status(200).json({
            message: "connection Request " + status + " By " + loggedInUser.firstName,
            data,
            success: true
        })
    }
    catch(error){
        res.status(400).send("Error :" + error.message)
    }
})

module.exports = requestRouter;