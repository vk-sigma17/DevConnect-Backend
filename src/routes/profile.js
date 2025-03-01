const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth')


// acess profile
profileRouter.get('/profile', userAuth, async(req, res) => {
    try{

        // const cookie = req.cookies;
    
        // const {token} = cookie;
        // if(!token){
        //     throw new Error("Invalid Token")
        // }

        // // validate my token
        // const decodedMsg = await jwt.verify(token, "Dev@Tinder&789")
    
        // console.log(decodedMsg)
        // const { _id} = decodedMsg;
        // console.log("Logged in user is: " + _id)
    
        // const user = await User.findById(_id)
        // if(!user){
        //     throw new Error("User Does Not Exist"); 
        // }
    
        // console.log(cookie);

        // No Need For Upper Code 
        const user = req.user;
        res.send(user)
    }
    catch(err){
        res.status(400).send(`E RROR: ${err.message}`)
    }
})


module.exports = profileRouter;