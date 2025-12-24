const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middleware/middleware');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {   

        const fromUserId = req.userId;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const existingConnectionRequest = await ConnectionRequest.findOne({ 
            $or: [{ fromUser: fromUserId, toUser: toUserId }, { fromUser: toUserId, toUser: fromUserId }]
        });
        
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }

        const _connectionRequest = new ConnectionRequest({
            fromUser: fromUserId,
            toUser: toUserId,
            status: status
        });

        await _connectionRequest.save();
        res.status(201).json({ message: "Connection request sent successfully" });
    } catch (err) {
        console.error("Error in /request route:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = requestRouter;