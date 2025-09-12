# LensVision E-commerce with Virtual Try-On

## Setup

1. Create a `.env.local` with:

```
MONGODB_URL=mongodb+srv://USER:PASS@CLUSTER/dbname
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_...
# NextAuth (optional admin)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
# Cloudinary (optional uploads)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_UPLOAD_PRESET=unsigned_preset
# Seed
SEED_TOKEN=dev-seed-secret
```

2. Install dependencies and run dev:

```
npm install
npm run dev
```

3. Seed sample products (endpoint):

```
curl -X POST http://localhost:3000/api/dev/seed -H "x-seed-token: dev-seed-secret"
```

Or manually via API:

```
POST /api/products
{
  "name": "Aviator",
  "price": 79.99,
  "image": "/assets/products/sunglasses1.jpg",
  "overlayImage": "/assets/products/sunglasses1.png",
  "category": "sunglasses",
  "stock": 10
}
```

## APIs
- `GET /api/products` – list products
- `POST /api/products` – create product
- `GET /api/products/:id` – get product
- `PUT /api/products/:id` – update product
- `DELETE /api/products/:id` – delete product
- `POST /api/orders` – create order from cart
- `POST /api/checkout` – create Stripe Checkout Session
- `POST /api/webhooks/stripe` – Stripe webhook endpoint
- `POST /api/upload` – Cloudinary upload (data URL)
- `POST /api/dev/seed` – seed demo products (x-seed-token required)

## Webhook setup (Stripe)
- Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Notes
- Cart is persisted in localStorage.
- Virtual try-on uses `face-api.js`; models are served from `/public/models`.
- For Stripe, set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`, and `STRIPE_WEBHOOK_SECRET` for webhooks.
- For uploads, create an unsigned preset in Cloudinary and set `CLOUDINARY_*` vars.
- If enabling auth/admin, configure NextAuth variables above.
