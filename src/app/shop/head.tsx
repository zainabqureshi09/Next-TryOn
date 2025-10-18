export default function Head() {
  return (
    <>
      <title>Shop Premium Eyewear | LensVision Collection</title>
      <meta name="description" content="Browse our exclusive collection of luxury eyewear. Designer frames, sunglasses, and prescription glasses with AI virtual try-on technology. Free shipping worldwide." />
      <meta name="keywords" content="shop eyewear online,luxury glasses,designer frames,sunglasses,prescription glasses,virtual try-on,LensVision collection,premium eyewear" />
      <link rel="canonical" href="/shop" />
      <meta property="og:title" content="Shop Premium Eyewear | LensVision Collection" />
      <meta property="og:description" content="Discover our exclusive collection of luxury eyewear with AI virtual try-on technology. Designer frames, sunglasses, and more." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/shop" />
      <meta property="og:image" content="/assets/shop-collection.jpg" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "LensVision Eyewear Collection",
            "description": "Premium luxury eyewear with AI virtual try-on technology",
            "url": "https://lensvision.com/shop",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Eyewear Products",
              "itemListElement": []
            }
          }),
        }}
      />
    </>
  );
}