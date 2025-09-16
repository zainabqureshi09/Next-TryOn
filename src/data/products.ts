export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: "sunglasses" | "prescription" | "blue-light";
};

export const products: Product[] = [
  {
    id: "aviator-001",
    name: "Classic Aviator",
    price: 129.99,
    description: "Timeless aviator frames with UV protection.",
    image: "/assets/frame1.jpg",
    category: "sunglasses",
  },
  {
    id: "bluelight-101",
    name: "Blue Light Shield",
    price: 89.99,
    description: "Reduce eye strain with blue light filtering lenses.",
    image: "/assets/bluelight.jpg",
    category: "blue-light",
  },
  {
    id: "retro-201",
    name: "Retro Round",
    price: 79.99,
    description: "Vintage-inspired round frames with modern comfort.",
    image: "/assets/female.jpg",
    category: "prescription",
  },
  {
    id: "sleek-301",
    name: "Sleek Minimal",
    price: 149.99,
    description: "Ultra-light prescription frames in matte black.",
    image: "/assets/homeMen.jpg",
    category: "prescription",
  },
  {
    id: "sport-401",
    name: "Sport Shield",
    price: 99.99,
    description: "Durable wrap-around sunglasses for active lifestyles.",
    image: "/assets/slide2home.jpg",
    category: "sunglasses",
  },
];


