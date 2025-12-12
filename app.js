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

