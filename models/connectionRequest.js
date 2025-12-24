const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: {
            values: ['ignore', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        },

    }
});
connectionRequestSchema.pre('save', async function(next) {
    const connectionRequest = this;
    console.log(`Connection Request from ${connectionRequest.fromUser} to ${connectionRequest.toUser} with status ${connectionRequest.status} is being created.`);
    if(connectionRequest.fromUser.toString() === connectionRequest.toUser.toString()){
       return next(new Error("Cannot send connection request to oneself."));
    }
});
connectionRequestSchema.index({fromUser: 1, toUser: 1});
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;
