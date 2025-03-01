// const express = require('express');
// const app = express( )


// it will give same response on any req (get, put, post) bcuz order matter
// app.use("/user",  (req, res) => {
//     res.send("Hahaha");
// })


// This will only handle GET call to /user
// app.get("/user",  (req, res) => {
//     res.send({firstName:  "Vikash", lastName: "Khowal"});
// })
 
// app.post('/user', (req, res) => {
//     // saving Data to Db
//     res.send("Data Successfully saved to database"); 
// })
// app.delete('/user', (req, res) => {
//     // saving Data to Db
//     res.send("Dalated Successfully!!"); 
// })


// //this will match all the HTTP method API calls to /test
// app.use('/test', (req, res) => {
//     console.log('Request to /test');
// });



// app.use('/test', (req, res) => { // fn is called req handler
    // res.send("Hello from test");
// })

// PART - 2

// app.use(
//     "/user",
//     (req, res, next) => {
//         console.log("handling the route User1");
//         res.send("Response 1"); //still it would not go on second response & just hang on postman
//         next(); //to take it to second response
//     },
//     (req, res, next) => {
//         console.log("handling the route user 2!");
//         res.send("2nd Response!!")
//         next()  // will go to 3re
//     },
//     (req, res) => {
//         console.log("handling the route user 3!");
//         res.send("3rd Response!!")
//     }
// )
 

//  PART - 3
// app.get("/user", (req, res, next) => {
//     console.log("handling Route 1");
//     next();
// })
// app.get("/user", (req, res) => {
//     console.log("handling Route 2");
//     res.send("Router 2")
// })

// Part - 4 (why to use middleware)
//  Handle Auth Middleware for all Get, Post,...requests

// const { adminAuth, userAuth }= require('./middlewares/auth')
// app.use("/admin", adminAuth)
// // app.use("/user", userAuthAuth) // also can write it as 

// app.get('/user', userAuth, (req, res) => {
//     res.send("User Data Sent");
// })

// app.get("/admin/getAllData", (req, res) => {
//     res.send("All Data Send")
// }) 

// app.get("/admin/deleteUser", (req, res) => {
//     res.send("All Data deleted")
// })


//  Part - 5 (Error Handlig )
// app.get("/user", (req, res) => {
//     //Logic of DB Call & Get User Data
//     throw new Error("DBSNNS");
//     res.send("User Data Sent")
// })

//  when throw error will give this error
// app.use('/', (err, req, res, next) => {
//     if(err){
//         // Log Your error Message
//         res.status(500).send("Something Went Wrong!")
//     }
// })
// app.get("/user", (req, res) => {
    
//     try{
//         //Logic of DB Call & Get User Data

//         throw new Error("dbbshhss");
//         res.send("User Data Sent")
//     }catch(err){
//         res.status(500).send("some Error contact support team")
//     }
   
// })

// connect node to database (mongoose)
const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth')
 
// middlewa re run on every request
app.use(express.json()); //convert json into js object
app.use(cookieParser())  // use to get token to send with other api

app.post('/signup', async (req, res) => {
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
app.post('/login', async(req, res) => {
    try{
        const { emailId, password } = req.body;

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

// acess profile
app.get('/profile', userAuth, async(req, res) => {
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
 
app.post('/sendConnectionReq', userAuth, (req, res) => {
    const user = req.user;
    // console.log("Send Connection Request!");
    res.send(user.firstName + "  Send Connection Request!");
})

connectDB() 
    .then(() => {
        console.log("Database Connection Esta...");
        app.listen(7777, () => {
            console.log("server is successfully listening to port 7777..")
        });
    })
    .catch((err) => {
        console.error("Database cannot b e esta");
    })



// app.listen(7777, () => {
//     console.log("server is listening successfully on port 7777...")
// })