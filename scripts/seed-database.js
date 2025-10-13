// scripts/seed-database.js
// Automated database seeding script for LensVision E-commerce

const mongoose = require('mongoose');

// Sample products data for the eyewear store
const sampleProducts = [
  {
    name: "Classic Aviator Gold",
    price: 129.99,
    description: "Timeless aviator frames with premium UV protection. Perfect for any face shape.",
    category: "sunglasses",
    style: "aviator",
    color: "gold",
    image: "/assets/frame1.jpg",
    overlayImage: "/frames/glasses.png",
    isActive: true,
    virtualTryOn: true,
    stock: 50,
    rating: 4.8,
    reviewCount: 152,
    specifications: {
      "Frame Material": "Metal",
      "Lens Type": "UV Protection",
      "Frame Width": "140mm",
      "Temple Length": "145mm"
    }
  },
  {
    name: "Professional Black Rectangle",
    price: 89.99,
    description: "Sleek rectangular frames perfect for professional settings and daily wear.",
    category: "men",
    style: "rectangular",
    color: "black",
    image: "/assets/homeMen.jpg",
    overlayImage: "/frames/glasses.png",
    isActive: true,
    virtualTryOn: true,
    stock: 75,
    rating: 4.9,
    reviewCount: 234,
    specifications: {
      "Frame Material": "Acetate",
      "Lens Type": "Blue Light Filter",
      "Frame Width": "138mm",
      "Temple Length": "142mm"
    }
  },
  {
    name: "Elegant Round Rose Gold",
    price: 99.99,
    description: "Vintage-inspired round frames with modern comfort. Perfect for women.",
    category: "women",
    style: "round",
    color: "rose-gold",
    image: "/assets/female.jpg",
    overlayImage: "/frames/glasses2.png",
    isActive: true,
    virtualTryOn: true,
    stock: 40,
    rating: 4.6,
    reviewCount: 89,
    specifications: {
      "Frame Material": "Metal",
      "Lens Type": "Clear",
      "Frame Width": "135mm",
      "Temple Length": "140mm"
    }
  },
  {
    name: "Cat Eye Elegance",
    price: 109.99,
    description: "Sophisticated cat eye frames for the modern, confident woman.",
    category: "women",
    style: "cat-eye",
    color: "tortoiseshell",
    image: "/assets/female.jpg",
    overlayImage: "/frames/glasses2.png",
    isActive: true,
    virtualTryOn: true,
    stock: 35,
    rating: 4.7,
    reviewCount: 176,
    specifications: {
      "Frame Material": "Acetate",
      "Lens Type": "Anti-Glare",
      "Frame Width": "142mm",
      "Temple Length": "145mm"
    }
  },
  {
    name: "Sport Shield Pro",
    price: 119.99,
    description: "Durable wrap-around sunglasses with polarized lenses for active lifestyles.",
    category: "sunglasses",
    style: "sport",
    color: "black",
    image: "/assets/slideHome.jpg",
    overlayImage: "/frames/glasses.png",
    isActive: true,
    virtualTryOn: true,
    stock: 60,
    rating: 4.5,
    reviewCount: 98,
    specifications: {
      "Frame Material": "Polymer",
      "Lens Type": "Polarized UV",
      "Frame Width": "145mm",
      "Temple Length": "130mm"
    }
  },
  {
    name: "Executive Titanium",
    price: 149.99,
    description: "Ultra-lightweight titanium frames for the discerning professional.",
    category: "men",
    style: "rectangular",
    color: "gunmetal",
    image: "/assets/homeMen.jpg",
    overlayImage: "/frames/glasses.png",
    isActive: true,
    virtualTryOn: true,
    stock: 25,
    rating: 5.0,
    reviewCount: 67,
    specifications: {
      "Frame Material": "Titanium",
      "Lens Type": "Blue Light + Anti-Glare",
      "Frame Width": "140mm",
      "Temple Length": "144mm"
    }
  },
  {
    name: "Retro Round Sunglasses",
    price: 94.99,
    description: "Vintage-inspired round sunglasses with gradient lenses.",
    category: "sunglasses",
    style: "round",
    color: "brown",
    image: "/assets/slideHome.jpg",
    overlayImage: "/frames/glasses.png",
    isActive: true,
    virtualTryOn: true,
    stock: 45,
    rating: 4.4,
    reviewCount: 123,
    specifications: {
      "Frame Material": "Metal",
      "Lens Type": "Gradient UV",
      "Frame Width": "136mm",
      "Temple Length": "142mm"
    }
  },
  {
    name: "Minimalist Wire Frame",
    price: 79.99,
    description: "Ultra-light wire frames for a barely-there feel with maximum style.",
    category: "women",
    style: "round",
    color: "silver",
    image: "/assets/female.jpg",
    overlayImage: "/frames/glasses2.png",
    isActive: true,
    virtualTryOn: true,
    stock: 55,
    rating: 4.3,
    reviewCount: 145,
    specifications: {
      "Frame Material": "Stainless Steel",
      "Lens Type": "Clear",
      "Frame Width": "134mm",
      "Temple Length": "138mm"
    }
  }
];

// MongoDB connection and seeding function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-eyewear-app';
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Define Product Schema (same as in the app)
    const productSchema = new mongoose.Schema({
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String },
      category: { type: String, required: true },
      style: { type: String },
      color: { type: String },
      image: { type: String },
      overlayImage: { type: String },
      isActive: { type: Boolean, default: true },
      virtualTryOn: { type: Boolean, default: true },
      stock: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      specifications: { type: Map, of: String },
      slug: { type: String }
    }, { timestamps: true });

    // Create slug before saving
    productSchema.pre('save', function(next) {
      if (this.isModified('name') || !this.slug) {
        this.slug = this.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      next();
    });

    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    // Clear existing products (optional)
    console.log('🗑️ Clearing existing products...');
    await Product.deleteMany({});

    // Insert sample products
    console.log('📦 Inserting sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Successfully inserted ${insertedProducts.length} products!`);
    console.log('');
    console.log('📊 Inserted Products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('🌐 Your application is now ready with sample products.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📋 Database connection closed.');
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();