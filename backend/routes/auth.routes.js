const User = require("../modules/user.module")
const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const { authenticateToken } = require("../middleware/auth")

const JWT_SECRET = process.env.JWT_SECRET || "ecommerce_secret_key_2026_jwt_token_auth";

//Registeration
//path:- /api/auth/register
router.post("/register", async (req,res) =>{

    try{
       const { name, email, password, phone } = req.body;

       if(!name || !email || !password || !phone) {
         return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, phone",
      });
       }

       const existingUser = await User.findOne({email: email.toLowerCase()})
       if(existingUser){
         return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
        });
       }

       const hashedPassword = await bcrypt.hash(password,10)
    //   default adress
       const initialAddresses = [
      {
        fullName: name,
        phone: phone,
        addressLine: "Flat 402, Royal Residency, MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        isDefault: true,
      },
    ];

    const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        addresses: initialAddresses
    })

    const token = jwt.sign(
        {
            userId: newUser._id, email: newUser.email, role: newUser.role
        },
        JWT_SECRET,
        {expiresIn: "7d"}
    )

    //after competion of registeration this is res
    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: {
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          addresses: newUser.addresses,
        },
      },
    });

    }catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
})

router.post("/login",async(req,res) =>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password"
            })
        }
        const user = await User.findOne({email:email.toLowerCase()}).select("+password");
        if(!user){
            return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
        {
            userId:user._id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        {expiresIn: "7d"}
    )

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
        },
        }
    })

    }catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
})

//get User

router.get("/me",authenticateToken, async (req,res) =>{
 try{
       const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
 }catch (error) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
})

module.exports = router