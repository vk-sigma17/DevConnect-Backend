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
const app = express();
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config(); 


// middleware run on every request
app.use(express.json()); //convert json into js object
app.use(cookieParser())  // use to get token to send with other api
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use("/", userRouter)


connectDB() 
    .then(() => {
        console.log("Database Connection Esta...");
        app.listen( process.env.PORT, () => {
            console.log("server is successfully listening to port 7777..")
        });
    })
    .catch((err) => {
        console.error("Database cannot b e esta");
    })



// app.listen(7777, () => {
//     console.log("server is listening successfully on port 7777...")
// })