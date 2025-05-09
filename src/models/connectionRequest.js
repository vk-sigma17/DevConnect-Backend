const mongoose = require('mongoose');


const connectionReqSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    } 
},{
    timestamps: true,
}
);

// middleware to stop the connection request to ourself.
connectionReqSchema.pre("save", function(next) {
    const connectionRequest = this;
    // check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to userself!!");
    }
    next();
})

// indexing will make query fast
// connectionReqSchema.find({fromUserId: 233444444444, toUserId: 535336366363})

connectionReqSchema.index({fromUserId: 1, toUserId: 1}) //compound index

const ConnectionReqModel = new mongoose.model('ConnectionReqModel', connectionReqSchema);

module.exports = ConnectionReqModel;