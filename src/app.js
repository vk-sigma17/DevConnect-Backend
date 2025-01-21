const express = require('express');
const app = express( )




app.use('/test', (req, res) => {
    console.log('Request to /test');
    res.send("Hello from test");
});

app.use('/hello', (req, res) => {
    console.log('Request to /hello');
    res.send("Hello Hello");
});

app.use('/', (req, res) => {
    res.send("Hello vikash!!")
})

// app.use('/test', (req, res) => { // fn is called req handler
    // res.send("Hello from test");
// })



app.listen(7777, () => {
    console.log("server is listening successfully on port 7777...")
})