const express = require('express');

const { connectDb }  = require('./config/database');

const User = require('./models/user');

const bcrypt = require('bcrypt');

const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middleware/middleware');


const app = express();

console.log("Hello, Dev-Tinder!");

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post("/login", async (req,res) => {
    try{

        if(!validator.isEmail(req.body.email)){
            return res.status(400).send("Invalid Email");
        }

        const user =  await User.findOne({ email : req.body.email });
        if(!user){
            return res.status(404).send("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordMatch){
            return res.status(401).send("Incorrect Password");
        }

        const token = await jwt.sign({ userId: user._id }, 'Savera146#', { expiresIn: '1h' });
        res.cookie('token', token,{expires: new Date(Date.now() + 900000), httpOnly: true});
        res.status(200).json({ message: "Login Successful", token });
    
    } catch(err){
        console.error("Error in /login route:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.get('/user',userAuth, async (req, res) => {
    try {
        const usersById = await User.findById(req.userId);
       res.send(usersById);
    } catch (err) {
        console.error("Error in /user route:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/feed', async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(error){
        console.error("Error in /feed route:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.patch('/user/:id', async (req, res) => {
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
      

console.log("After /signup route");

connectDb().then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
console.log("Server setup complete.");
}).catch((err) => {
    console.error("Database connection error:", err);
});

console.log("After Server setup");

