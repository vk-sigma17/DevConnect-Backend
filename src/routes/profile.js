const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
// const { validateSignUpData } = require('../utils/validation');
const {validateEditProfileData} = require('../utils/validation')

// acess profile
profileRouter.get('/profile/view', userAuth, async(req, res) => {
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

profileRouter.patch('/profile/edit', userAuth, async(req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!!")
        }
        const loggedInUser = req.user;
         Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        await loggedInUser.save();
        // res.send(`${loggedInUser.firstName} Profile updated SuccessfullY!`)
        
        res.json({
            message: `${loggedInUser.firstName}, Your profile updated successfully!`,
            data: loggedInUser
        })
    }
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
})

module.exports = profileRouter; 