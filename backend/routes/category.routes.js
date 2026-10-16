const Category = require("../modules/category.module")
const express = require("express")
const router = express.Router() 


router.get("/", async (req,res) =>{
    try{
        const categoryList = await Category.find()
         return res.status(200).json({
            success: true,
            data: {
                categoryList,
                },
        });
    } catch (error) {
     console.error("Error fetching category:", error);

     return res.status(500).json({
      success: false,
      message: "Error while fetching category",
    });
    }
})

module.exports = router