const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require('validator');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try{
        console.log(req.body);

        const passwordHash = await bcrypt.hash(req.body.password, 10);
        req.body.password = passwordHash;

        const user = new User(req.body);
        await user.save();
        res.status(201).send("User signed up successfully");
    }
    catch(err){
        console.error("Error in /signup route:", err);
    }
});

authRouter.post("/login", async (req,res) => {
    try{

        if(!validator.isEmail(req.body.email)){
            return res.status(400).send("Invalid Email");
        }

        const user =  await User.findOne({ email : req.body.email });
        if(!user){
            return res.status(404).send("User not found");
        }

        const isPasswordMatch = await user.isPasswordMatch(req.body.password);
        if(!isPasswordMatch){
            return res.status(401).send("Incorrect Password");
        }

        const token = await user.getJwtToken();
        res.cookie('token', token,{expires: new Date(Date.now() + 900000), httpOnly: true});
        res.status(200).json({ message: "Login Successful", user });
    
    } catch(err){
        console.error("Error in /login route:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = authRouter;





