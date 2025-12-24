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

module.exports = userRouter;
