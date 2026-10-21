const Wishlist = require("../modules/wishlist.module")
const {authenticateToken} = require("../middleware/auth")
const express = require("express")
const router = express.Router()

//add wishlist prod's
router.post("/",authenticateToken, async(req,res) =>{
    try{
         const {productId} = req.body
         if(!productId) {
            return res.status(400).json({
            success: false,
            message: "Product ID is required",
            });
          }
          let wishlist = await Wishlist.findOne({user:req.user.userId})
          console.log(wishlist);
          if(!wishlist) {
            wishlist = new Wishlist({user:req.user.userId, products: []})
          }

          const productExists = wishlist.products.some(
            (id) => id.toString() === productId.toString()
        )
        if(!productExists){
            wishlist.products.push(productId)
            await wishlist.save()
        }
        const updatedWishlist = await Wishlist.findById(wishlist._id).populate("products")
        return res.status(200).json({
            success: true,
            message: "successful added product to wishlist",
            data:{wishlist: updatedWishlist.products}
        })
    }catch(error){
    console.error("Add to Wishlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error adding to wishlist",
      error: error.message,
    });
  }
})
//get all wishlist data
router.get("/",authenticateToken,async(req,res) =>{
    try{
       let wishlist = await Wishlist.findOne({user: req.user.userId}).populate("products")
       if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.userId, products: [] });
      }
      return res.status(200).json({
      success: true,
      data: {
        wishlist: wishlist.products,
      },
    });
    }catch(error)
    {
    console.error("Fetch Wishlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching wishlist",
      error: error.message,
    });
  }
})


router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { wishlist: [] },
      });
    }
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate("products");

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: {
        wishlist: updatedWishlist.products,
      },
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error removing from wishlist",
      error: error.message,
    });
  }
});

module.exports  = router