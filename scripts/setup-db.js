#!/usr/bin/env node

/**
 * Database Setup Script for LensVision
 * 
 * This script will:
 * 1. Check MongoDB connection
 * 2. Create necessary collections
 * 3. Seed initial product data
 * 4. Create admin user (optional)
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Sample eyewear products
const sampleProducts = [
  {
    name: "Classic Aviator Sunglasses",
    description: "Timeless aviator style with premium UV protection. Perfect for any outdoor activity.",
    category: "sunglasses",
    style: "aviator",
    color: "Gold/Brown",
    price: 159.99,
    stock: 25,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    overlayImage: "/frames/aviator.png",
    isActive: true,
    virtualTryOn: true,
    rating: 4.5,
    reviewCount: 128,
    specifications: {
      "Frame Material": "Metal",
      "Lens Material": "Glass",
      "UV Protection": "100%",
      "Frame Width": "140mm",
      "Bridge Width": "14mm"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Modern Round Frames",
    description: "Contemporary round eyeglasses with lightweight titanium frame. Blue light filtering included.",
    category: "men",
    style: "round",
    color: "Black",
    price: 129.99,
    stock: 30,
    image: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=400",
    overlayImage: "/frames/round.png",
    isActive: true,
    virtualTryOn: true,
    rating: 4.7,
    reviewCount: 89,
    specifications: {
      "Frame Material": "Titanium",
      "Lens Material": "Polycarbonate",
      "Blue Light Filter": "Yes",
      "Frame Width": "135mm",
      "Bridge Width": "16mm"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Elegant Cat Eye",
    description: "Sophisticated cat-eye frames with subtle rhinestone details. Perfect for professional or casual wear.",
    category: "women",
    style: "cat-eye",
    color: "Tortoise",
    price: 149.99,
    stock: 20,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400",
    overlayImage: "/frames/cat-eye.png",
    isActive: true,
    virtualTryOn: true,
    rating: 4.8,
    reviewCount: 156,
    specifications: {
      "Frame Material": "Acetate",
      "Lens Material": "CR-39",
      "Frame Width": "142mm",
      "Bridge Width": "15mm",
      "Temple Length": "140mm"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sport Wraparound",
    description: "High-performance wraparound sunglasses designed for active lifestyles. Impact-resistant and lightweight.",
    category: "sunglasses",
    style: "wraparound",
    color: "Matte Black",
    price: 199.99,
    stock: 15,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400",
    overlayImage: "/frames/sport.png",
    isActive: true,
    virtualTryOn: true,
    rating: 4.6,
    reviewCount: 203,
    specifications: {
      "Frame Material": "TR90",
      "Lens Material": "Polycarbonate",
      "UV Protection": "100%",
      "Impact Resistant": "Yes",
      "Frame Width": "145mm"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Vintage Square Frames",
    description: "Retro-inspired square frames with modern comfort features. Suitable for prescription or fashion wear.",
    category: "men",
    style: "square",
    color: "Brown Tortoise",
    price: 119.99,
    stock: 22,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    overlayImage: "/frames/square.png",
    isActive: true,
    virtualTryOn: true,
    rating: 4.4,
    reviewCount: 67,
    specifications: {
      "Frame Material": "Acetate",
      "Lens Material": "CR-39",
      "Frame Width": "138mm",
      "Bridge Width": "16mm",
      "Temple Length": "145mm"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Minimalist Wire Frame",
    description: "Ultra-lightweight wire frame glasses with adjustable nose pads. Perfect for all-day comfort.",
    category: "women",
    style: "wire",
    color: "Rose Gold",
    price: 99.99,
    stock: 35,
    image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400",
    overlayImage: "/frames/wire.png",
    isActive: true,
    virtualTryOn: true,
    rating: 4.3,
    reviewCount: 94,
    specifications: {
      "Frame Material": "Stainless Steel",
      "Lens Material": "Mineral Glass",
      "Adjustable Nose Pads": "Yes",
      "Frame Width": "132mm",
      "Bridge Width": "18mm"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('Please add MONGODB_URI to your .env.local file');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

async function setupDatabase() {
  const client = await connectToDatabase();
  const db = client.db();

  try {
    // Check if products collection exists and has data
    console.log('📊 Checking existing data...');
    const productsCollection = db.collection('products');
    const existingProducts = await productsCollection.countDocuments();

    if (existingProducts > 0) {
      console.log(`📦 Found ${existingProducts} existing products`);
      const proceed = await askUser('Do you want to clear existing products and add sample data? (y/N): ');
      
      if (proceed.toLowerCase() === 'y' || proceed.toLowerCase() === 'yes') {
        console.log('🗑️  Clearing existing products...');
        await productsCollection.deleteMany({});
      } else {
        console.log('⏭️  Skipping product seeding');
        await client.close();
        return;
      }
    }

    // Insert sample products
    console.log('🌱 Seeding sample products...');
    const result = await productsCollection.insertMany(sampleProducts);
    console.log(`✅ Inserted ${result.insertedCount} sample products`);

    // Create indexes for better performance
    console.log('🔍 Creating database indexes...');
    await productsCollection.createIndex({ name: 'text', description: 'text' });
    await productsCollection.createIndex({ category: 1 });
    await productsCollection.createIndex({ isActive: 1 });
    await productsCollection.createIndex({ price: 1 });
    console.log('✅ Database indexes created');

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Products: ${sampleProducts.length} items added`);
    console.log(`   • Categories: ${[...new Set(sampleProducts.map(p => p.category))].join(', ')}`);
    console.log(`   • Price range: $${Math.min(...sampleProducts.map(p => p.price))} - $${Math.max(...sampleProducts.map(p => p.price))}`);

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await client.close();
  }
}

function askUser(question) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run the setup
console.log('🚀 LensVision Database Setup');
console.log('============================\n');

setupDatabase().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});