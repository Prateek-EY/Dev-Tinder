const mongoose = require('mongoose');


console.log("Before connect DB...");
const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://pdprateek146:lV13hpzjgtVoAZCZ@saveratisri.jdjaqan.mongodb.net/devTinder");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}
console.log("Before connect DB Then...");
module.exports = {connectDb};


console.log("After connect DB Then...");