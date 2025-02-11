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

// middleware run on every request
app.use(express.json()); //convert json into js object

app.post('/signup', async (req, res) => {
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
        // {

        //     firstName: "Ms",
        //     lastName: "Dhoni",
        //     emailId: "DhoniMs@gmail.com",
        //     password: "DhoniMs@123"
        // }
        req.body
    )
    try{
        await user.save();
        res.send("User Added Successfully!!")
    } catch(err){
        res.status(400).send("Error saving the user:", err.message)
    }

// })
});

//get user by email
app.get('/userTest', async(req, res) => {
    const userEmail = req.body.emailId;
    console.log(userEmail);
    try{
        // const users = await User.find({emailId: userEmail});
        const users = await User.findOne({emailId: userEmail});
       if(users.length === 0){
        res.status(404).send("User Not Found!")
       }else{

           res.send(users);
       }
    }
    catch(err){
        res.status(400).send("Something Went Wrong")
    }

}) 

//Feed API - Get/feed - get all the users from the database
app.get('/feed', async(req, res) => {
    const user2 = await User.find({})
    res.send(user2);
})

//delete
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try{
        // const user = await User.findByIdAndDelete({ _id: userId});
        //Shortend
        const user = await User.findByIdAndDelete(userId);
        res.send("user Deleted Successfully!")
          
    }
    catch(err){
        res.status(400).send("Something Went Wrong ")
    }
})
// update data of user
app.patch('/user', async (req, res) => {
    const data = req.body;
    const userId = req.body.userId;
    try{
        await User.findByIdAndUpdate({_id: userId}, data);
    // to previous & next data after update
        // const user = await User.findByIdAndUpdate({_id: userId}, data, {
        //     returnDocument: "after",
        // });
        // const user = await User.findByIdAndUpdate({_id: userId}, data, {
        //     returnDocument: "after",
        // });
        // console.log(user)
        res.send('Data Updated Successfully');
    }catch(err){
        console.log("Someing Went Wrong!!")
    }
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