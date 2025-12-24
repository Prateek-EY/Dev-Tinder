const express = require('express');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middleware/middleware');
console.log("Inside userRouter file");
const Users = require('../models/user');

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

userRouter.get('/users/feed',userAuth, async (req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const loggedInUserId = req.userId;
        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUser: loggedInUserId}, {toUser: loggedInUserId}]
        });
        console.log(connectionRequests);
        const excludedUserIds = new Set();
        connectionRequests.forEach(request => {
            excludedUserIds.add(request.fromUser.toString());
            excludedUserIds.add(request.toUser.toString());
        });

        const users = await Users.find({
          $and:[
            {_id: { $nin: Array.from(excludedUserIds) }},
            {_id: { $ne: loggedInUserId }}          ]
        }).select('firstName lastName email').skip(skip).limit(limit);
        res.status(200).json(users);
    }
    catch(error){
        console.error("Error in /feed route:", error);
        res.status(500).json({ message: "Internal server error" });
    }

});

module.exports = userRouter;
