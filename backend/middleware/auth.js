const jwt = require("jsonwebtoken")

const authenticateToken = (req,res,next) =>{
     const authHeader = req.headers["authorization"]
     const token = authHeader && authHeader.split(" ")[1]

     
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: No token provided. Please log in.",
    });
  }

  try{
    const secret = process.env.JWT_SECRET || "ecommerce_secret_key_2026_jwt_token_auth";

    const decoded = jwt.verify(token,secret)
    req.user = decoded  // { userId, email, role }
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

module.exports = {authenticateToken}