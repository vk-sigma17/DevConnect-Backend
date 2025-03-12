const express = require('express');
const authRouter = express.Router();

const { validateSignUpData, validateLoginData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');





authRouter.post('/signup', async (req, res) => {
    try{
        // Validation of data
        validateSignUpData(req);
        
        const { firstName, lastName, emailId, password} = req.body;
        
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
    
        // console.log(req.body);
        // const userObj = {
    
        //     firstName: "Vikash",
        //     lastName: "khowal",
        //     emailId: "khowalvikash@gmail.com",
        //     password: "khowal@123"
        // }
        // //creating a new instance of User Model
        // const user = new User(userObj)
    
        //OR
        //Creating New instance of user Model
        const user = new User(
            // first Method
            // {
    
            //     firstName: "Ms",
            //     lastName: "Dhoni",
            //     emailId: "DhoniMs@gmail.com",
            //     password: "DhoniMs@123"
             // }

            //  2nd Method 
            // req.body

            //Good way to explain each part
            { firstName, lastName, emailId, password: passwordHash}
        )
        await user.save();
        res.send("User Added Successfully!!")
    } catch(err){
        res.status(400).send(`ERROR: ${err.message}`)
    }

// })
});

// login Api
authRouter.post('/login', async(req, res) => {
    const { emailId, password } = req.body;
    try{
        validateLoginData(req)
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){ 

            const token = await user.getJWT();
            console.log(token);
            // add token to cookie and send the response back to user
            res.cookie("token", token, {
                 expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send("User Login Successfully");
        }else{
            throw new Error("Invalid Credentials")
        }

    }
    catch(err){
        res.status(400).send(`ERROR: ${err.message}`)
    }
}) 

// Logout API
authRouter.post('/logout', async(req, res) => {
    res.cookie('token', null, {
        expires : new Date(Date.now()),
    }).send("Logout Successfull!!")
    // res.send()
})

module.exports = authRouter;