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

requestRouter.post('/request/respond/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const requestId = req.params.requestId;
        const status = req.params.status;

        const allowedStatuses = ["accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const connectionRequest = await ConnectionRequest.findOne({_id : requestId, toUser: loggedInUserId, status: 'interested'});
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found or already responded to" });
        }

        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({ message: `Connection request ${status} successfully` });


    } catch (err) {
        console.error("Error in /request/respond route:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = requestRouter;