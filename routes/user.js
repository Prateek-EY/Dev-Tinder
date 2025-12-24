const express = require('express');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middleware/middleware');
console.log("Inside userRouter file");

userRouter.get('/user/requests/received',userAuth, async (req, res) => {
    try{
        console.log("Inside /user/requests/received route");
        const loggedInUserId = req.userId;
        const receivedRequests = await ConnectionRequest.find({ toUser: loggedInUserId, status: 'interested'})
        .populate('fromUser', 'firstName lastName email');
        res.status(200).json(receivedRequests);
    }
    catch (err) {
        console.error("Error in /user/requests/received route:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.get('/user/requests/connections', userAuth, async (req, res) => {
    try{
        const connectionRequests = await ConnectionRequest.find({ 
            $or: [
                { fromUser: req.userId, status: 'accepted' },
                { toUser: req.userId, status: 'accepted' }
            ]
        })
        .populate('fromUser', 'firstName lastName email').populate('toUser', 'firstName lastName email');
        const data = connectionRequests.map(row => { 
            if(row.fromUser._id.toString() === req.userId){
                return row.toUser;
            }
            return row.fromUser;
        });
        res.status(200).json(data);
    }
    catch (err) {
        console.error("Error in /user/requests/connections route:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = userRouter;
