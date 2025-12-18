const express= require('express');
const User = require('../models/user');
const { userAuth } = require('../middleware/middleware');
const profileRouter = express.Router();

profileRouter.get('/user',userAuth, async (req, res) => {
    try {
        const usersById = await User.findById(req.userId);
       res.send(usersById);
    } catch (err) {
        console.error("Error in /user route:", err);
        res.status(500).send("Internal Server Error");
    }
});

profileRouter.get('/feed', async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(error){
        console.error("Error in /feed route:", error);
        res.status(500).send("Internal Server Error");
    }
});

profileRouter.patch('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const userData = await User.findByIdAndUpdate(userId, req.body, { runValidators: true });
        if (!userData) {
            return res.status(404).send("User not found");
        }
        res.send(userData);
    } catch (err) {
        console.error("Error in /user/:id route:", err);
        res.status(500).send("Internal Server Error");
    }   
});

module.exports = profileRouter;
