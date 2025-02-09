
const mongoose = require('mongoose');



 const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://khowalvikash:vikash123@clusternode.j6vvp.mongodb.net/codeNode"
    ); 
 };

module.exports =  connectDB;
 



