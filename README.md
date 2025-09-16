# LensVision - AI-Powered Virtual Try-On E-commerce

A modern, full-stack e-commerce application built with Next.js 14, featuring AI-powered virtual try-on technology for eyewear. This application provides a complete shopping experience with user authentication, product management, shopping cart, and secure payment processing.

## 🚀 Features

### Core E-commerce Features
- **Product Catalog**: Browse and search eyewear products with categories
- **Shopping Cart**: Add, remove, and manage items with persistent storage
- **Checkout Flow**: Secure payment processing with Stripe integration
- **Order Management**: Track orders and view order history
- **User Authentication**: Sign in with Google OAuth or email/password
- **Admin Dashboard**: Manage products, orders, and view analytics

### AI Virtual Try-On
- **Real-time Try-On**: Use webcam or upload photos for virtual try-on
- **Frame Overlay**: Try different eyewear frames on your face
- **Adjustable Settings**: Scale and position frames for perfect fit
- **Multiple Frame Types**: Aviator, Blue Light, Round, and Classic frames

### Technical Features
- **Server-Side Rendering**: Optimized performance with Next.js 14
- **Database Integration**: MongoDB with Mongoose for data persistence
- **Image Optimization**: Next.js Image component for optimal loading
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe
- **State Management**: Zustand
- **UI Components**: Radix UI, Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── checkout/      # Payment processing
│   │   ├── orders/        # Order management
│   │   ├── products/      # Product CRUD operations
│   │   └── webhooks/      # Stripe webhooks
│   ├── components/        # Reusable UI components
│   ├── admin/             # Admin dashboard pages
│   ├── account/           # User account pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── product/           # Product detail pages
│   └── shop/              # Product listing pages
├── lib/                   # Utility functions and configurations
│   ├── models/            # MongoDB schemas
│   ├── auth.ts            # NextAuth configuration
│   ├── dbConnect.ts       # Database connection
│   └── validation.ts      # Zod schemas
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
└── types.ts               # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- Stripe account (for payments)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```env
   # Database Configuration
   MONGODB_URL="mongodb://localhost:27017/lensvision"
   # For production: mongodb+srv://username:password@cluster.mongodb.net/lensvision

   # NextAuth Configuration
   NEXTAUTH_SECRET="your-super-secret-key-here-minimum-32-characters"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Admin Credentials
   ADMIN_EMAIL="admin@lensvision.com"
   ADMIN_PASSWORD="your-secure-admin-password"

   # Stripe Payment Configuration
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

   # Site Configuration
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   
   Start your MongoDB instance or connect to MongoDB Atlas.

5. **Seed the database (optional)**
   ```bash
   curl -X POST http://localhost:3000/api/dev/seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Database Setup

1. **Local MongoDB**: Install MongoDB locally and start the service
2. **MongoDB Atlas**: Create a free cluster and get your connection string
3. **Update MONGODB_URL** in your `.env.local` file

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up webhooks for payment processing:
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

3. **Set production environment variables**
   ```env
   MONGODB_URL="mongodb+srv://username:password@cluster.mongodb.net/lensvision"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
   NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push to main branch

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `MONGODB_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID` (if using Google OAuth)
- `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BASE_URL`

## 📱 Usage

### For Customers

1. **Browse Products**: Visit the shop page to see available eyewear
2. **Virtual Try-On**: Use the try-on feature to see how frames look on you
3. **Add to Cart**: Add products to your shopping cart
4. **Checkout**: Complete your purchase with Stripe payment processing
5. **Track Orders**: View your order history in your account

### For Administrators

1. **Sign In**: Use admin credentials to access the admin dashboard
2. **Manage Products**: Add, edit, or remove products
3. **View Orders**: Monitor customer orders and update status
4. **Analytics**: View sales statistics and user metrics

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/lensvision/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Stripe for payment processing
- MongoDB for database services
- All open-source contributors

---

**Built with ❤️ using Next.js 14**