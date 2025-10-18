"use client";

import Link from "next/link";
import Image from "next/image";
import { useReveal } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, stock }) => {
  const ref = useReveal({ y: 40, duration: 0.8 });
  const { t } = useTranslation();
  const isOut = (stock ?? 0) <= 0;
  const isLow = !isOut && (stock as number) <= 3;

  return (
    <Link href={`/product/${id}`} className="group">
      {/* ✅ yaha ref lagaya, ab sahi chalega */}
      <div
        ref={ref as any}
        className="border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
      >
        {isOut && (
          <span className="absolute top-3 left-3 z-10 rounded bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
            {t("product.outOfStock")}
          </span>
        )}
        {isLow && (
          <span className="absolute top-3 left-3 z-10 rounded bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
            {t("product.lowStock")}
          </span>
        )}
        <div className="relative aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 bg-card/90">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-primary font-bold mt-2">${price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
