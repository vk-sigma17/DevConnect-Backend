 const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try{

            //Read The Token from req cookies
            const { token } = req.cookies;
            if(!token){
                return res.status(401).send("Please Login!!")
            }
            // Validate the token
            const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        
            const {_id} = decodedObj;
            // Find The User
            const user = await User.findById(_id);
            if(!user){
                throw new Error("user not Found");
                
            }
            req.user = user // attaching the find user to req
            next()
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message)
    }
}

module.exports = {
    userAuth
}














//  const adminAuth = (req, res, next) => {
//     console.log("Admin Auth is getting Checked!!");
//     const token = 'xyz';
//     const isAdminAuthorized = token === 'xyz';
//     if(!isAdminAuthorized){
//         res.status(401).send("UnAuthorized request");
//     }else{
//         next();
//     }
// };

//  const userAuth = (req, res, next) => {
//     console.log("Admin Auth  is getting Checked!!");
//     const token = 'xyzabc';
//     const isAdminAuthorized = token === 'xyz';
//     if(!isAdminAuthorized){
//         res.status(401).send("UnAuthorized request");
//     }else{ 
//         next();
//     }
// };

// module.exports = { adminAuth, userAuth }