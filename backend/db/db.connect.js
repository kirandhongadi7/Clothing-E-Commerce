const mongoose = require("mongoose")
require("dotenv").config()
const dns = require("dns")
dns.setServers(["1.1.1.1", "8.8.8.8"])

const mongoUri  = process.env.MONGO_URI

const initializeDatabase = async()=>{

    await mongoose.connect(mongoUri).then(() =>{
        console.log("DB connect successfully");
        
    }).catch((e) =>{
        console.log("Error while connecting,", e.message);
        
    })
}
module.exports  = {initializeDatabase}