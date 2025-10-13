# 🚀 LensVision Setup Guide

Complete setup instructions for getting your AI-powered virtual try-on e-commerce app up and running.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git** (for cloning and version control)

## 🛠️ Quick Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/lensvision
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lensvision

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Stripe (for payments)
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Database Setup

#### Option A: Automated Setup (Recommended)
```bash
node scripts/setup-db.js
```

This script will:
- ✅ Test MongoDB connection
- 🌱 Seed sample eyewear products
- 🔍 Create database indexes
- 📊 Display setup summary

#### Option B: Manual Setup
1. Ensure MongoDB is running on your system
2. The app will create collections automatically on first run
3. Use the admin panel at `/admin/products/manage` to add products manually

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ MongoDB Setup Options

### Local MongoDB

1. **Download and install MongoDB**: [MongoDB Community Server](https://www.mongodb.com/try/download/community)

2. **Start MongoDB service**:
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb/brew/mongodb-community
   
   # Linux (Ubuntu/Debian)
   sudo systemctl start mongod
   ```

3. **Set your connection string**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/lensvision
   ```

### MongoDB Atlas (Cloud)

1. **Create account**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster** (free tier available)

3. **Get connection string**:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` with your values

4. **Update environment**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lensvision
   ```

## 📱 Key Features Setup

### Virtual Try-On

The virtual try-on feature uses MediaPipe for face detection. No additional setup required - it works out of the box with your camera.

### Admin Panel

Access the product management interface at:
```
http://localhost:3000/admin/products/manage
```

Features:
- ➕ Add new products
- ✏️ Edit existing products
- 👁️ Toggle product visibility
- 🗑️ Delete products
- 🔍 Search and filter products

### E-commerce Features

- 🛒 Shopping cart (using Zustand state management)
- 💳 Stripe payment integration (optional)
- 👤 User authentication with NextAuth.js
- 📊 Product catalog with filtering

## 🧪 Testing the Setup

### 1. Homepage
Visit `http://localhost:3000` - should load the main landing page

### 2. Virtual Try-On
Go to `/virtual-try-on` and test:
- Camera access permission
- Face detection overlay
- Product selection and overlay
- Add to cart functionality

### 3. Admin Panel
Visit `/admin/products/manage` to:
- View seeded products
- Add a test product
- Toggle product status

### 4. Database Verification
Check that products were created:
```bash
# If using MongoDB locally
mongosh lensvision
> db.products.find().limit(3)

# Or check via the app
curl http://localhost:3000/api/products
```

## 🚨 Troubleshooting

### Database Connection Issues

**Error**: `MongooseServerSelectionError`
```bash
# Check if MongoDB is running
mongod --version

# Test connection
node -e "require('mongodb').MongoClient.connect('mongodb://localhost:27017/test', console.log)"
```

### Camera Access Issues

**Error**: Camera not working in virtual try-on
- Ensure you're using HTTPS in production
- Check browser permissions
- Test with different browsers

### Missing Environment Variables

**Error**: `MONGODB_URI is not defined`
- Double-check your `.env.local` file exists
- Restart the development server after creating/modifying `.env.local`
- Ensure the file is in the project root directory

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check
```

## 📚 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build
npm start

# Database setup
node scripts/setup-db.js

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔧 Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin interface
│   │   └── virtual-try-on/    # Try-on page
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configs
│   └── models/               # Database models
├── public/                    # Static assets
├── scripts/                   # Setup and utility scripts
└── WARP.md                   # Project documentation
```

## 🎯 What's Next?

After successful setup, you can:

1. **Customize the design** - Modify components in `src/components/`
2. **Add more products** - Use the admin panel or database scripts
3. **Set up payments** - Configure Stripe integration
4. **Deploy** - Follow the deployment section in `WARP.md`
5. **Add features** - Implement wishlists, reviews, or advanced filters

## 💡 Production Deployment

For production deployment, see the deployment section in `WARP.md` for:
- Vercel deployment
- Environment variable configuration
- Domain setup
- Performance optimization

---

**Need help?** Check the project's `WARP.md` file for detailed technical information or create an issue in the repository.