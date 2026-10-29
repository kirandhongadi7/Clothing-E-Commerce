const {initializeDatabase} = require("./db/db.connect")
const Product = require("./modules/product.module")
const Category = require("./modules/category.module")
const User = require("./modules/user.module")
const bcrypt = require("bcrypt")

const sampleCategories = [
  {
    name: "Lehenga Choli",
    description: "Grand bridal and festive lehenga cholis with royal embroidery and voluminous flares.",
    tagline: "Royal Wedding & Festive Glamour",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Half-Saree",
    description: "Traditional South Indian Langa Voni and Dhavani sets woven with pure silk and zari.",
    tagline: "Timeless South Indian Heritage",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Salwar Kameez",
    description: "Classic Punjabi and straight-cut suits combining everyday elegance with all-day comfort.",
    tagline: "Everyday Grace & Comfort",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Anarkali Suit",
    description: "Floor-length majestic flared Anarkalis detailed with sequins, gotta patti and pearl accents.",
    tagline: "Regal Flared Splendor",
    image: "https://images.unsplash.com/photo-1596783049187-54dca838cf40?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kurta Sets",
    description: "Contemporary ethnic kurta sets with dupattas and tailored cigarette pants.",
    tagline: "Contemporary Festive Chic",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sharara and Gharara Sets",
    description: "Dramatic wide-legged tiered bottoms paired with short kurtas and heavily bordered dupattas.",
    tagline: "Mughal-Inspired Statement Wear",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
  },
];
const sampleProducts = [
  // Lehenga Choli
  {
    name: "Crimson Red Bridal Zari Lehenga",
    description: "A show-stopping crimson velvet lehenga choli embellished with hand-embroidered antique gold zardozi and sequins. Comes with a double net dupatta.",
    category: "Lehenga Choli",
    price: 14999,
    discountPrice: 11999,
    stock: 8,
    rating: 4.8,
    ratingCount: 142,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "Free Size"],
    colors: ["Crimson Red", "Maroon"],
    fabric: "Micro Velvet & Net",
    work: "Heavy Zardozi, Dori & Sequins",
    isFeatured: true,
  },
  {
    name: "Emerald Green Floral Printed Silk Lehenga",
    description: "Lightweight organza and pure silk lehenga adorned with pastel digital floral prints and mirror lace border. Ideal for sangeet and mehendi celebrations.",
    category: "Lehenga Choli",
    price: 8499,
    discountPrice: 6499,
    stock: 12,
    rating: 4.6,
    ratingCount: 89,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Emerald Green", "Mint"],
    fabric: "Pure Organza Silk",
    work: "Mirror Work & Foil Print",
    isFeatured: true,
  },
  {
    name: "Pastel Blush Pink Georgette Lehenga",
    description: "Delicate blush pink georgette lehenga with tone-on-tone resham thread embroidery and scalloped dupatta edge.",
    category: "Lehenga Choli",
    price: 9999,
    discountPrice: 7999,
    stock: 10,
    rating: 4.7,
    ratingCount: 65,
    images: [
      "https://images.unsplash.com/photo-1596783049187-54dca838cf40?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blush Pink", "Peach"],
    fabric: "Pure Georgette",
    work: "Resham Thread & Moti Work",
    isFeatured: false,
  },

  // Half-Saree
  {
    name: "Kanchipuram Pattu Half-Saree Set",
    description: "Traditional South Indian Dhavani ensemble featuring pure Kanchipuram silk pleats with temple zari borders and heavily embroidered unstitched blouse.",
    category: "Half-Saree",
    price: 11499,
    discountPrice: 8999,
    stock: 6,
    rating: 4.9,
    ratingCount: 110,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["Free Size", "M", "L"],
    colors: ["Mustard Yellow", "Royal Magenta"],
    fabric: "Pure Kanchipuram Silk",
    work: "Pure Gold Zari Weave & Maggam Work",
    isFeatured: true,
  },
  {
    name: "Peacock Blue Chanderi Langa Voni",
    description: "Regal peacock blue and bottle green Chanderi silk half saree with woven zari checks and contrasting banarasi brocade dupatta.",
    category: "Half-Saree",
    price: 6999,
    discountPrice: 5299,
    stock: 14,
    rating: 4.4,
    ratingCount: 45,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Peacock Blue", "Green"],
    fabric: "Chanderi Silk Blend",
    work: "Zari Buta Weaving",
    isFeatured: false,
  },

  // Salwar Kameez
  {
    name: "Midnight Blue Velvet Embroidered Suit",
    description: "Luxurious royal blue velvet kurta paired with straight trousers and embroidered organza dupatta. Perfect for evening cocktail parties.",
    category: "Salwar Kameez",
    price: 4999,
    discountPrice: 3899,
    stock: 18,
    rating: 4.5,
    ratingCount: 98,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Midnight Blue", "Navy"],
    fabric: "Micro Velvet",
    work: "Tilla & Zari Embroidery",
    isFeatured: true,
  },
  {
    name: "Dusty Rose Chanderi Straight Suit",
    description: "Graceful daily and festive wear straight cut suit with gotta patti detailing along neckline and sleeve hems.",
    category: "Salwar Kameez",
    price: 3299,
    discountPrice: 2499,
    stock: 25,
    rating: 4.3,
    ratingCount: 76,
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL", "3XL"],
    colors: ["Dusty Rose", "Mauve"],
    fabric: "Chanderi Cotton",
    work: "Gotta Patti & Zari",
    isFeatured: false,
  },

  // Anarkali Suit
  {
    name: "Royal Ivory Floor-Length Anarkali Gown",
    description: "An ethereal 56-kali flared floor-length georgette Anarkali gown with Lucknowi chikankari thread embroidery and mukesh work.",
    category: "Anarkali Suit",
    price: 8999,
    discountPrice: 6999,
    stock: 9,
    rating: 4.9,
    ratingCount: 165,
    images: [
      "https://images.unsplash.com/photo-1596783049187-54dca838cf40?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Cream", "Gold"],
    fabric: "Pure Georgette & Shantoon",
    work: "Lucknowi Chikankari & Moti Work",
    isFeatured: true,
  },
  {
    name: "Maroon Angrakha Flared Anarkali",
    description: "Deep maroon Anarkali with Angrakha cross-over neckline, tassel ties, and gold foil stamped floral borders.",
    category: "Anarkali Suit",
    price: 5499,
    discountPrice: 4299,
    stock: 15,
    rating: 4.4,
    ratingCount: 52,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon", "Wine"],
    fabric: "Rayon Blend",
    work: "Gold Foil Print & Dori Work",
    isFeatured: false,
  },
  {
    name: "Teal Printed Anarkali Suit",
    description: "A lightweight teal Anarkali suit with subtle floral detailing and a matching dupatta, designed for comfortable everyday wear.",
    category: "Anarkali Suit",
    price: 2499,
    discountPrice: 1999,
    stock: 20,
    rating: 2.4,
    ratingCount: 18,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Teal"],
    fabric: "Cotton Blend",
    work: "Printed Floral Detail",
    isFeatured: false,
  },

  // Kurta Sets
  {
    name: "Sage Green Embroidered Kurta & Pant Set",
    description: "Contemporary ethnic style featuring a mandarin collar kurta with intricate thread work on yokes and matching slim pants.",
    category: "Kurta Sets",
    price: 2899,
    discountPrice: 1999,
    stock: 30,
    rating: 4.2,
    ratingCount: 88,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Sage Green", "Olive"],
    fabric: "Cotton Silk",
    work: "Thread Embroidery",
    isFeatured: false,
  },
  {
    name: "Mustard Silk Blend Kurta with Jacquard Dupatta",
    description: "Festive mustard straight kurta matched with gold woven banarasi jacquard dupatta and comfortable palazzo pants.",
    category: "Kurta Sets",
    price: 3599,
    discountPrice: 2799,
    stock: 22,
    rating: 4.6,
    ratingCount: 114,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Mustard Yellow", "Golden Orange"],
    fabric: "Silk Blend",
    work: "Jacquard Weaving",
    isFeatured: true,
  },

  // Sharara and Gharara Sets
  {
    name: "Lavender Georgette Tiered Sharara Suit",
    description: "Stunning pastel lavender peplum kurta with multi-tiered flared sharara and mirror-trimmed sheer dupatta.",
    category: "Sharara and Gharara Sets",
    price: 6799,
    discountPrice: 5199,
    stock: 11,
    rating: 4.7,
    ratingCount: 81,
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pastel Lavender", "Lilac"],
    fabric: "Faux Georgette",
    work: "Mirror & Sequin Work",
    isFeatured: true,
  },
  {
    name: "Ruby Wine Silk Gharara with Heavy Dupatta",
    description: "Traditional Awadhi style gharara set in rich ruby wine silk with gold gotta patti and dabka embroidery.",
    category: "Sharara and Gharara Sets",
    price: 8999,
    discountPrice: 6999,
    stock: 7,
    rating: 4.8,
    ratingCount: 57,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Ruby Wine", "Deep Maroon"],
    fabric: "Pure Art Silk",
    work: "Gotta Patti & Dabka",
    isFeatured: false,
  },
];

async function seedData() {
try{
    
    await initializeDatabase().then(() =>{
        console.log("DB Started!!");
        
    }).catch((e) =>{
        console.log("Error while connect db", e.message);
    })   

    const seedCategory = await Category.insertMany(sampleCategories)
    console.log("Category are seeded into DB", seedCategory.length);

    const seedProducts = await Product.insertMany(sampleProducts)
    console.log("Products are seeded in db",seedProducts.length);

    const hashPassword = await bcrypt.hash("@DemoKiran7", 10)

    await User.create({
        name: "Kiran",
        email: "KiranDemo@gmail.com",
        password: hashPassword,
        phone: "+91 80736 40695",
        role: "customer",
        addresses: [
        {
          fullName: "Kiran Demo",
          phone: "+91 80736 40695",
          addressLine: "#18, Navanagar BGK, Karnataka",
          city: "Bagalkot",
          state: "Karnataka",
          pincode: "587103",
          isDefault: true,
        },
        {
          fullName: "Kiran Demo (Office)",
          phone: "+91 80736 40695",
          addressLine: "Tech Park Block B, Whitefield",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560066",
          isDefault: false,
        },
      ],
      
    })
console.log("User Data seeded successfully into DB");
}catch(e) {
    console.log("Error while seeding ,", e);
}
}

// seedData()