const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const connectionRequest = require("../models/connectionRequest")
const User = require('../models/user')

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"


// Request Received API
userRouter.get("/user/requests/recieved", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        if(connectionRequests){
            return res.status(200).json({
                connectionRequests,
            });
        }

    }catch(err){
        res.status(400).send("Error :" + err.message);
        }

})

// GET/User/Connections (who accepted my connections)
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);  

        //   console.log(connectionRequests)
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            data
        })

    }catch(err){
        res.status(400).send({message: err.message})
    }
})

// feed Api
userRouter.get("/feed", userAuth, async(req, res) => {
    try{
        //  1. should see all users card(except his own card & his connection)
        // 2. not see - i. ingored card ii. send already connections request 
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // find all connection requests (send + received)
    const connectionRequests = await connectionRequest.find({
        $or : [
            {fromUserId: loggedInUser._id},
            {toUserId: loggedInUser._id}
        ]
    }).select("fromUserId toUserId");

    // hidden users from feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(element => {
        hideUsersFromFeed.add(element.fromUserId.toString());
        hideUsersFromFeed.add(element.toUserId.toString());
    });

    const users = await User.find({
        $and: [
            {_id: {$nin: Array.from(hideUsersFromFeed)}}, // $nin = not in this array than includes it
            {_id: {$ne: loggedInUser._id}}, //$ne = not equal than include it
        ], 
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);


    res.send(users);
    
    }
    catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}) 


module.exports = userRouter;