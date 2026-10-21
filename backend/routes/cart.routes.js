const express = require("express");
const router = express.Router();
const Cart = require("../modules/cart.module");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate({
      path: "items.product",
      model: "Product",
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }
    const validItems = cart.items.filter((item) => item.product != null);

    return res.status(200).json({
      success: true,
      data: {
        cart: validItems,
      },
    });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching cart",
      error: error.message,
    });
  }
});

//   POST /api/user/cart

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId, size = "M", color = "Standard", quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      // increase quantity
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        size,
        color,
        quantity: Number(quantity),
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "Product",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: {
        cart: updatedCart.items,
      },
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error adding to cart",
      error: error.message,
    });
  }
});

// POST /api/user/cart/:productId

router.post("/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body; // "increment" or "decrement"

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    if (action === "increment") {
      cart.items[itemIndex].quantity += 1;
    } else if (action === "decrement") {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'increment' or 'decrement'",
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "Product",
    });

    return res.status(200).json({
      success: true,
      message: `Item quantity ${action}ed`,
      data: {
        cart: updatedCart.items,
      },
    });
  } catch (error) {
    console.error("Update Cart Quantity Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating cart quantity",
      error: error.message,
    });
  }
});

//   DELETE /api/user/cart/:productId

router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { cart: [] },
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "Product",
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: {
        cart: updatedCart.items,
      },
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error removing from cart",
      error: error.message,
    });
  }
});

module.exports = router;
