const express = require("express");
const router = express.Router();
const User = require("../modules/user.module");
const { authenticateToken } = require("../middleware/auth");


router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    console.error("Fetch Addresses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching addresses",
      error: error.message,
    });
  }
});

 //POST /api/user/addresses

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { fullName, phone, addressLine, city, state, pincode, isDefault } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required address fields",
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If marked as default, unmark other addresses
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: {
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error adding address",
      error: error.message,
    });
  }
});

//  PUT /api/user/addresses/:addressId

router.put("/:addressId", authenticateToken, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, addressLine, city, state, pincode, isDefault } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (addressLine) address.addressLine = addressLine;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: {
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Update Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating address",
      error: error.message,
    });
  }
});

//  DELETE /api/user/addresses/:addressId

router.delete("/:addressId", authenticateToken, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId.toString()
    );

    // If there is no default left and there are addresses, make the first one default
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: {
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Delete Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting address",
      error: error.message,
    });
  }
});

module.exports = router;
