const jwt = require('jsonwebtoken');
const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).send("Access Denied. No token provided.");
    }
    try {
        const isTokenValid = await jwt.verify(token, 'Savera146#');
        req.userId = isTokenValid.userId;
        next();
    } catch (err) {
        console.error("Error in userAuth middleware:", err);
        res.status(401).send("Invalid Token");
    }
}
module.exports = { userAuth };