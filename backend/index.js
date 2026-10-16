const express = require("express")
const app = express()
const {initializeDatabase} = require("./db/db.connect")
const productRoutes = require("./routes/product.routes")
const categoryRoutes = require("./routes/category.routes")
const dns = require("dns")
app.use(express.json())
dns.setServers(["1.1.1.1","8.8.8.8"])
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/",(req,res) =>{
    res.send("Server started")
})

app.use("/api/products",productRoutes)
app.use("/api/category",categoryRoutes)

const PORT = process.env.PORT || 5000
initializeDatabase().then(() =>{
    app.listen(PORT,() =>{
        console.log("Server connected successfully");
    })
}).catch((e) =>{
    console.log("Error while connecting ", e.message);
    
})