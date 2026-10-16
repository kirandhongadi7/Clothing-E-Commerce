const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Lehenga Choli",
        "Half-Saree",
        "Salwar Kameez",
        "Anarkali Suit",
        "Kurta Sets",
        "Sharara and Gharara Sets",
      ],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 15,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    images: {
      type: [String],
      required: true,
      default: [],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },

    ratingCount: {
      type: Number,
      default: 95,
    },

    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL"],
    },

    colors: {
      type: [String],
      default: ["Red", "Blue", "Gold"],
    },

    fabric: {
      type: String,
      default: "Silk Blend",
    },

    work: {
      type: String,
      default: "Zari & Embroidery",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
