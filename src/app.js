const express = require('express');
const app = express( )


// it will give same response on any req (get, put, post) bcuz order matter
// app.use("/user",  (req, res) => {
//     res.send("Hahaha");
// })


// This will only handle GET call to /user
app.get("/user",  (req, res) => {
    res.send({firstName:  "Vikash", lastName: "Khowal"});
})
 
app.post('/user', (req, res) => {
    // saving Data to Db
    res.send("Data Successfully saved to database"); 
})
app.delete('/user', (req, res) => {
    // saving Data to Db
    res.send("Dalated Successfully!!"); 
})


//this will match all the HTTP method API calls to /test
app.use('/test', (req, res) => {
    console.log('Request to /test');
});



// app.use('/test', (req, res) => { // fn is called req handler
    // res.send("Hello from test");
// })



app.listen(7777, () => {
    console.log("server is listening successfully on port 7777...")
})