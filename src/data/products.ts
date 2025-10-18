export type Product = {
  _id?: string;
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  inStock?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  freeShipping?: boolean;
  discount?: number;
  colors?: string[];
  sizes?: string[];
};

export const products: Product[] = [
  {
    _id: "aviator-001",
    id: "aviator-001",
    name: "Classic Aviator",
    price: 129.99,
    description: "Timeless aviator frames with UV protection.",
    image: "/assets/frame1.jpg",
    category: "sunglasses",
    brand: "LensVision",
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    _id: "men-minimal-101",
    id: "men-minimal-101",
    name: "Minimal Black",
    price: 89.99,
    description: "Sleek minimal frames perfect for professional settings.",
    image: "/assets/homeMen.jpg",
    category: "men",
    brand: "LensVision",
    inStock: true,
    rating: 4.3,
    reviewCount: 95,
  },
  {
    _id: "women-round-201",
    id: "women-round-201",
    name: "Elegant Round",
    price: 99.99,
    description: "Vintage-inspired round frames with modern comfort.",
    image: "/assets/female.jpg",
    category: "women",
    brand: "LensVision",
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    _id: "men-sport-301",
    id: "men-sport-301",
    name: "Sport Pro",
    price: 149.99,
    description: "Athletic frames designed for active lifestyles.",
    image: "/assets/homeMen.jpg",
    category: "men",
    brand: "LensVision",
    inStock: true,
    rating: 4.6,
    reviewCount: 87,
  },
  {
    _id: "sunglasses-sport-401",
    id: "sunglasses-sport-401",
    name: "Sport Shield",
    price: 119.99,
    description: "Durable wrap-around sunglasses with polarized lenses.",
    image: "/assets/slideHome.jpg",
    category: "sunglasses",
    brand: "LensVision",
    inStock: true,
    rating: 4.4,
    reviewCount: 67,
  },
  {
    _id: "women-cat-501",
    id: "women-cat-501",
    name: "Cat Eye Classic",
    price: 109.99,
    description: "Sophisticated cat eye frames for elegant style.",
    image: "/assets/female.jpg",
    category: "women",
    brand: "LensVision",
    inStock: true,
    rating: 4.8,
    reviewCount: 142,
  },
];


