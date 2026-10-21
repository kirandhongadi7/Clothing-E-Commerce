const express = require("express");
const router = express.Router();
const Order = require("../modules/order.module");
const Cart = require("../modules/cart.module");
const { authenticateToken } = require("../middleware/auth");

//    GET /api/user/orders

router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching order history",
      error: error.message,
    });
  }
});

//    POST /api/user/orders

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod = "COD" } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided for the order",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }


const formattedItems = items.map((item) => {
  const product = item.product;

  return {
    product: product?._id || product,
    name: product?.name || item.name || "Traditional Attire",
    image: product?.images?.[0] || item.image || "",
    size: item.size || "M",
    color: item.color || "Standard",
    quantity: item.quantity || 1,
    price: product?.price || item.price || 0,
  };
});


    const newOrder = await Order.create({
      user: req.user.userId,
      items: formattedItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      orderStatus: "placed",
    });

    // Clear users
    await Cart.findOneAndUpdate(
      { user: req.user.userId },
      { $set: { items: [] } }
    );

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully.",
      data: {
        order: newOrder,
      },
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error placing order",
      error: error.message,
    });
  }
});

module.exports = router;
