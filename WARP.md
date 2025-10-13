# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LensVision is an AI-powered virtual try-on e-commerce application built with Next.js 14, featuring real-time face detection and eyewear overlay functionality. The application combines e-commerce features with advanced computer vision capabilities using TensorFlow.js and MediaPipe.

## Development Commands

### Essential Commands
```bash
# Development server
npm run dev

# Production build  
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Setup
```bash
# Seed database with sample data (development only)
curl -X POST http://localhost:3000/api/dev/seed
```

### Environment Setup
- Copy `env.example` to `.env.local` and configure required environment variables
- MongoDB connection string is required for database functionality
- Stripe keys needed for payment processing
- Google OAuth credentials for authentication (optional)

## Architecture Overview

### Next.js App Router Structure
The application uses Next.js 14 App Router with the following key architectural patterns:

**API Layer (`src/app/api/`)**
- RESTful API endpoints organized by domain (admin, auth, cart, orders, products)
- Webhook handlers for Stripe payment processing
- Authentication handled via NextAuth.js with multiple providers

**Page Structure (`src/app/`)**
- Feature-based routing (admin, auth, cart, checkout, catalog, shop, tryon)
- Dynamic routes for product details `[id]` and category pages `[slug]`
- Admin dashboard with comprehensive management tools

**Component Architecture (`src/components/` and `src/app/components/`)**
- Shared UI components in global `src/components/`
- Page-specific components co-located with routes in `src/app/components/`
- Separation between AI/camera components and e-commerce UI components

### Key Technical Integrations

**AI/Computer Vision Stack**
- TensorFlow.js for face detection and landmarks
- MediaPipe for advanced face mesh processing  
- Custom WebGL detection utilities for performance optimization
- Real-time camera processing with React webcam integration

**State Management**
- Zustand for client-side state (shopping cart)
- MongoDB with Mongoose for persistent data
- NextAuth session management

**Payment Processing**
- Stripe integration with webhooks
- PayPal SDK for alternative payment methods
- Order management system with status tracking

### Database Models
Located in `src/lib/models/`, key entities include:
- User profiles and authentication
- Product catalog with categories and variants
- Shopping cart persistence
- Order management and history

## Development Guidelines

### File Organization
- Use the `@/*` path alias for imports from the `src` directory
- Co-locate page-specific components with their routes
- Keep shared utilities in `src/lib/` and `src/utils/`

### AI/Computer Vision Features
- Face detection components are performance-sensitive and require WebGL support
- TensorFlow.js models are loaded asynchronously - handle loading states
- Camera permissions must be requested before accessing webcam features
- Test across different devices and browsers for compatibility

### API Development
- API routes follow RESTful conventions with proper HTTP methods
- Authentication middleware protects admin and user-specific endpoints
- Error handling uses consistent JSON response format
- Database connections are handled via the connection utility in `src/lib/mongodb.ts`

### Styling and UI
- Tailwind CSS with custom theme extensions for animations and colors
- Radix UI components for accessible primitives
- Framer Motion for complex animations
- Dark mode support via next-themes
- Custom CSS variables for theme consistency

### Environment Considerations
- MongoDB connection required for all database operations
- Stripe webhook endpoint must be configured for payment processing
- Camera features require HTTPS in production environments
- TensorFlow.js models need proper CORS configuration for external hosting

### Testing and Development
- Face detection features require actual camera access for full testing
- Payment flows should be tested with Stripe test mode
- Admin features require proper role-based access control
- Database seeding available for development data setup

## Key Dependencies

**Core Framework**
- Next.js 14 with App Router and React 18
- TypeScript for type safety

**AI/ML Libraries** 
- @tensorflow/tfjs with WebGL backend
- @tensorflow-models/face-landmarks-detection
- @mediapipe/face_mesh and camera_utils

**E-commerce Integration**
- Stripe and PayPal SDKs for payments
- MongoDB with Mongoose for data persistence
- NextAuth.js for authentication

**UI/UX**
- Tailwind CSS with animations
- Radix UI component primitives
- Framer Motion for animations
- Lucide React for icons

## Special Configurations

### Webpack Configuration
Next.js config includes special handling for:
- TensorFlow.js browser compatibility fallbacks
- ESM module support for AI libraries
- Image optimization for product catalogs
- Console log removal in production builds

### TypeScript Configuration
- Path mapping configured for `@/*` imports
- Strict mode enabled for better type safety
- Includes DOM types for browser APIs