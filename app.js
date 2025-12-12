const express = require('express');

const { connectDb }  = require('./config/database');

const User = require('./models/user');


const app = express();

console.log("Hello, Dev-Tinder!");

app.use(express.json());

app.post('/signup', async (req, res) => {
    try{
        console.log(req.body);

        const user = new User(req.body);
        await user.save();
        res.status(201).send("User signed up successfully");
    }
    catch(err){
        console.error("Error in /signup route:", err);
    }
});

app.get('/user', async (req, res) => {
    try {
        const users = await User.findOne({email : req.body.emailId});
        res.status(200).json(users);
    } catch (err) {
        console.error("Error in /user route:", err);
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

