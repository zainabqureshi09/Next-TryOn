"use client";

import Image from "next/image";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

interface GlassesSelectorProps {
  selectedGlasses: string;
  onGlassesChange: (glasses: string) => void;
}

const glassesOptions = [
  {
    id: "aviator",
    name: "Aviator Classic",
    description: "Timeless pilot-style frames",
    color: "Silver",
    price: "$199",
    preview: "/frames/glasses.png",
  },
  {
    id: "wayfarer",
    name: "Wayfarer Bold",
    description: "Iconic rectangular frames",
    color: "Black",
    price: "$249",
    preview: "/frames/glasses2.png",
  },
  {
    id: "round",
    name: "Round Vintage",
    description: "Classic circular frames",
    color: "Gold",
    price: "$179",
    preview: "/glasses/round.png",
  },
  {
    id: "cat-eye",
    name: "Cat-Eye Retro",
    description: "Vintage feminine style",
    color: "Pink",
    price: "$229",
    preview: "/glasses/cat-eye.png",
  },
];

export const GlassesSelector = ({
  selectedGlasses,
  onGlassesChange,
}: GlassesSelectorProps) => {
  return (
    <div className="space-y-4">
      {glassesOptions.map((glasses) => (
        <Card
          key={glasses.id}
          className={`relative cursor-pointer transition-all duration-200 ${
            selectedGlasses === glasses.id
              ? "bg-tech-surface-hover border-tech-glow/60 shadow-[var(--shadow-tech)]"
              : "bg-tech-surface border-border hover:bg-tech-surface-hover hover:border-tech-glow/30"
          }`}
          onClick={() => onGlassesChange(glasses.id)}
        >
          <div className="p-4 flex items-center gap-4 transition-all duration-300 hover:bg-tech-surface-hover/50">
            {/* Glasses Preview Image */}
            <div className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              <Image
                src={glasses.preview}
                alt={glasses.name}
                width={64}
                height={64}
                className="object-contain hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Glasses Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{glasses.name}</h3>
                {selectedGlasses === glasses.id && (
                  <Check className="w-4 h-4 text-tech-glow animate-pulse" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {glasses.description}
              </p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs bg-tech-surface-hover px-3 py-1">
                  {glasses.color}
                </Badge>
                <span className="text-sm font-medium text-tech-glow">{glasses.price}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
