const express = require('express');
const { connectDb }  = require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();

console.log("Hello, Dev-Tinder!");

app.use(express.json());
app.use(cookieParser());
   
app.use('/', require('./routes/auth'));
console.log("After /auth route");
app.use('/', require('./routes/profile'));
console.log("After /profile route");
app.use('/',require('./routes/request'));
console.log("After /request route");

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

