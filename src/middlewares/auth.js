 const adminAuth = (req, res, next) => {
    console.log("Admin Auth is getting Checked!!");
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyz';
    if(!isAdminAuthorized){
        res.status(401).send("UnAuthorized request");
    }else{
        next();
    }
};

 const userAuth = (req, res, next) => {
    console.log("Admin Auth is getting Checked!!");
    const token = 'xyzabc';
    const isAdminAuthorized = token === 'xyz';
    if(!isAdminAuthorized){
        res.status(401).send("UnAuthorized request");
    }else{ 
        next();
    }
};

module.exports = { adminAuth, userAuth }