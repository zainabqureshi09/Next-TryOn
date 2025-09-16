import Image from "next/image";
import Link from "next/link";

type Props = { params: { slug: string } };

const slugToTitle: Record<string, string> = {
  men: "Men",
  women: "Women",
  blulelight: "Blue Light", // as requested (typo preserved)
  "blue-light": "Blue Light",
  sunglasses: "Sunglasses",
  kids: "Kids",
};

// Map catalog slug -> shop category slug for deep link
const slugToShopCategory: Record<string, string> = {
  men: "prescription",
  women: "prescription",
  kids: "prescription",
  blulelight: "blue-light",
  "blue-light": "blue-light",
  sunglasses: "sunglasses",
};

const dummyItems: Record<string, { id: string; name: string; price: number; image?: string }[]> = {
  men: [
    { id: "m1", name: "Men Classic", price: 119.99, image: "/assets/homeMen.jpg" },
    { id: "m2", name: "Men Modern", price: 139.99, image: "/assets/frame1.jpg" },
  ],
  women: [
    { id: "w1", name: "Women Cat Eye", price: 129.99, image: "/assets/slideHome.jpg" },
    { id: "w2", name: "Women Retro", price: 99.99, image: "/assets/female.jpg" },
  ],
  blulelight: [
    { id: "b1", name: "Blue Light Lite", price: 79.99, image: "/assets/bluelight.jpg" },
    { id: "b2", name: "Blue Light Pro", price: 99.99, image: "/assets/bluelight.jpg" },
  ],
  "blue-light": [
    { id: "bl1", name: "Blue Light Lite", price: 79.99, image: "/assets/bluelight.jpg" },
    { id: "bl2", name: "Blue Light Pro", price: 99.99, image: "/assets/bluelight.jpg" },
  ],
  sunglasses: [
    { id: "s1", name: "Aviator", price: 129.99, image: "/assets/frame1.jpg" },
    { id: "s2", name: "Sport Shield", price: 99.99, image: "/assets/slide2home.jpg" },
  ],
  kids: [
    { id: "k1", name: "Kids Fun", price: 59.99, image: "/assets/slide3.jpg" },
    { id: "k2", name: "Kids Flex", price: 69.99, image: "/assets/slide3.jpg" },
  ],
};

export default function CatalogSlugPage({ params }: Props) {
  const title = slugToTitle[params.slug] || params.slug.replace(/-/g, " ").toUpperCase();
  const items = dummyItems[params.slug] || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">{title}</h1>
      <div className="mb-6">
        <Link
          href={`/shop${slugToShopCategory[params.slug] ? `?category=${slugToShopCategory[params.slug]}` : ""}`}
          className="inline-block px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
        >
          Shop this category
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="space-y-4">
          <p className="text-gray-600">No items in this category yet.</p>
          <Link href="/catalog" className="text-purple-700 hover:underline">← Back to Catalog</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((p) => (
            <div key={p.id} className="rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow">
              <div className="relative w-full h-56 bg-gray-100">
                <Image
                  src={p.image || "/assets/slide3.jpg"}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-purple-700 font-bold">${p.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



