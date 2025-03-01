const express = require('express');
const requestRouter = express();
const { userAuth } = require('../middlewares/auth')


requestRouter.post('/sendConnectionReq', userAuth, (req, res) => {
    const user = req.user;
    // console.log("Send Connection Request!");
    res.send(user.firstName + "  Send Connection Request!");
})

module.exports = requestRouter;