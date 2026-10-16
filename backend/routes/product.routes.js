const Product = require("../modules/product.module")
const express = require("express")
const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching products",
    });
  }
});

router.get("/:productId", async (req,res) =>{
    try{
      const {productId} = req.params
    const product = await Product.findById(productId)

    if(!product){
        res.status(404).json({
            success: false,
            message: "No product found"
        })
        return
    }

    res.status(200).json({
        success: true,
        data: {
            product,
        }
    })
    }catch(e){
       return res.status(500).json({
       success: false,
       message: "Error while fetching product",
    });
    }
})

module.exports = router