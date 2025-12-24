const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['ignore', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        },

    }
});
connectionRequestSchema.pre('save',function (){
    const connectionRequest = this;
    console.log(`Connection Request from ${connectionRequest.fromUser} to ${connectionRequest.toUser} with status ${connectionRequest.status} is being created.`);
    if(connectionRequest.fromUser.toString() === connectionRequest.toUser.toString()){
        throw new Error("Cannot send connection request to oneself.");
    }
    next();
});
connectionRequestSchema.index({fromUser: 1, toUser: 1});
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;
