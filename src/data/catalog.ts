export type CatalogCategory = {
  slug: "men" | "women" | "sunglasses";
  name: string;
  description?: string;
  image?: string;
};

export const categories: CatalogCategory[] = [
  {
    slug: "men",
    name: "Men",
    description: "Stylish eyewear designed for men.",
    image: "/assets/homeMen.jpg",
  },
  {
    slug: "women",
    name: "Women",
    description: "Elegant frames perfect for women.",
    image: "/assets/female.jpg",
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    description: "Protect your eyes in style with UV protection.",
    image: "/assets/slideHome.jpg",
  },
];


