export type CatalogCategory = {
  slug: "sunglasses" | "prescription" | "blue-light";
  name: string;
  description?: string;
  image?: string;
};

export const categories: CatalogCategory[] = [
  {
    slug: "sunglasses",
    name: "Sunglasses",
    description: "Protect your eyes in style with polarized lenses.",
    image: "/assets/slideHome.jpg",
  },
  {
    slug: "prescription",
    name: "Prescription Glasses",
    description: "Everyday clarity with comfortable frames.",
    image: "/assets/homeCen.jpg",
  },
  {
    slug: "blue-light",
    name: "Blue Light",
    description: "Reduce eye strain from screens.",
    image: "/assets/bluelight.jpg",
  },
];


