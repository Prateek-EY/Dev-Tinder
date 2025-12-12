const express = require('express');

const app = express();



app.get("/user",(req,res) => {
    res.send("User route is working fine");
});



// app.post("/user",(req,res) => {
//     res.send("Post request to user route is working fine");
// });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});