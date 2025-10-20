"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  colors: string[];
  materials: string[];
  sizes: string[];
  rating: number;
  inStock: boolean;
  onSale: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const categories = [
  { id: "men", label: "Men's Glasses", count: 156 },
  { id: "women", label: "Women's Glasses", count: 234 },
  { id: "sunglasses", label: "Sunglasses", count: 189 },
];

const collections = [
  { id: "lensvision-classic", label: "LensVision Classic", count: 89 },
  { id: "lensvision-premium", label: "LensVision Premium", count: 76 },
  { id: "lensvision-sport", label: "LensVision Sport", count: 45 },
  { id: "lensvision-vintage", label: "LensVision Vintage", count: 38 },
  { id: "lensvision-modern", label: "LensVision Modern", count: 29 },
];

const colors = [
  { id: "black", label: "Black", color: "#000000", count: 234 },
  { id: "brown", label: "Brown", color: "#8B4513", count: 189 },
  { id: "gold", label: "Gold", color: "#FFD700", count: 156 },
  { id: "silver", label: "Silver", color: "#C0C0C0", count: 123 },
  { id: "blue", label: "Blue", color: "#0000FF", count: 98 },
  { id: "red", label: "Red", color: "#FF0000", count: 87 },
  { id: "green", label: "Green", color: "#008000", count: 65 },
  { id: "pink", label: "Pink", color: "#FFC0CB", count: 54 },
];

const materials = [
  { id: "plastic", label: "Plastic", count: 345 },
  { id: "metal", label: "Metal", count: 234 },
  { id: "titanium", label: "Titanium", count: 123 },
  { id: "acetate", label: "Acetate", count: 98 },
  { id: "wood", label: "Wood", count: 34 },
  { id: "carbon", label: "Carbon Fiber", count: 23 },
];

const sizes = [
  { id: "small", label: "Small (48-50mm)", count: 156 },
  { id: "medium", label: "Medium (51-53mm)", count: 234 },
  { id: "large", label: "Large (54-56mm)", count: 189 },
  { id: "xlarge", label: "X-Large (57mm+)", count: 87 },
];

type CheckedState = boolean | "indeterminate";

export default function ProductFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    collections: true,
    price: true,
    colors: true,
    materials: false,
    sizes: false,
    rating: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: CheckedState) => {
    const newCategories = checked === true
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleCollectionChange = (collectionId: string, checked: CheckedState) => {
    const newCollections = checked === true
      ? [...filters.brands, collectionId]
      : filters.brands.filter((id) => id !== collectionId);
    onFiltersChange({ ...filters, brands: newCollections });
  };

  const handleColorChange = (colorId: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, colorId]
      : filters.colors.filter((id) => id !== colorId);
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handleMaterialChange = (materialId: string, checked: CheckedState) => {
    const newMaterials = checked === true
      ? [...filters.materials, materialId]
      : filters.materials.filter((id) => id !== materialId);
    onFiltersChange({ ...filters, materials: newMaterials });
  };

  const handleSizeChange = (sizeId: string, checked: CheckedState) => {
    const newSizes = checked === true
      ? [...filters.sizes, sizeId]
      : filters.sizes.filter((id) => id !== sizeId);
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const FilterSection = ({
    title,
    isExpanded,
    onToggle,
    children,
  }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors"
      >
        {title}
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isExpanded && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.materials.length +
    filters.sizes.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  return (
    <Card className={`${isOpen ? "block" : "hidden"} lg:block sticky top-4`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-purple-600 hover:text-purple-700"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-0 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Categories */}
        <FilterSection
          title="Categories"
          isExpanded={expandedSections.categories}
          onToggle={() => toggleSection("categories")}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked: CheckedState) =>
                    handleCategoryChange(category.id, checked)
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
              <span className="text-xs text-gray-500">
                ({category.count})
              </span>
            </div>
          ))}
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection("price")}
        >
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value: number[]) =>
                onFiltersChange({
                  ...filters,
                  priceRange: value as [number, number],
                })
              }
              max={1000}
              step={10}
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}+</span>
            </div>
          </div>
        </FilterSection>

        {/* Collections */}
        <FilterSection
          title="Collections"
          isExpanded={expandedSections.collections}
          onToggle={() => toggleSection("collections")}
        >
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`collection-${collection.id}`}
                  checked={filters.brands.includes(collection.id)}
                  onCheckedChange={(checked: CheckedState) =>
                    handleCollectionChange(collection.id, checked)
                  }
                />
                <Label
                  htmlFor={`collection-${collection.id}`}
                  className="text-sm cursor-pointer"
                >
                  {collection.label}
                </Label>
              </div>
              <span className="text-xs text-gray-500">
                ({collection.count})
              </span>
            </div>
          ))}
        </FilterSection>

        {/* Colors */}
        <FilterSection
          title="Colors"
          isExpanded={expandedSections.colors}
          onToggle={() => toggleSection("colors")}
        >
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <div key={color.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                    filters.colors.includes(color.id)
                      ? "border-purple-600 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color.color }}
                  onClick={() =>
                    handleColorChange(color.id, !filters.colors.includes(color.id))
                  }
                />
                <span className="text-xs text-gray-600 mt-1">
                  {color.label}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Materials */}
        <FilterSection
          title="Frame Material"
          isExpanded={expandedSections.materials}
          onToggle={() => toggleSection("materials")}
        >
          {materials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material.id}`}
                  checked={filters.materials.includes(material.id)}
                  onCheckedChange={(checked: CheckedState) =>
                    handleMaterialChange(material.id, checked)
                  }
                />
                <Label
                  htmlFor={`material-${material.id}`}
                  className="text-sm cursor-pointer"
                >
                  {material.label}
                </Label>
              </div>
              <span className="text-xs text-gray-500">
                ({material.count})
              </span>
            </div>
          ))}
        </FilterSection>

        {/* Sizes */}
        <FilterSection
          title="Frame Size"
          isExpanded={expandedSections.sizes}
          onToggle={() => toggleSection("sizes")}
        >
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size.id}`}
                  checked={filters.sizes.includes(size.id)}
                  onCheckedChange={(checked: CheckedState) =>
                    handleSizeChange(size.id, checked)
                  }
                />
                <Label
                  htmlFor={`size-${size.id}`}
                  className="text-sm cursor-pointer"
                >
                  {size.label}
                </Label>
              </div>
              <span className="text-xs text-gray-500">({size.count})</span>
            </div>
          ))}
        </FilterSection>

        {/* Rating */}
        <FilterSection
          title="Customer Rating"
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection("rating")}
        >
          {[4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 ${
                filters.rating === rating ? "bg-purple-50" : ""
              }`}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  rating: filters.rating === rating ? 0 : rating,
                })
              }
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">& Up</span>
            </div>
          ))}
        </FilterSection>

        {/* Availability */}
        <FilterSection
          title="Availability"
          isExpanded={expandedSections.availability}
          onToggle={() => toggleSection("availability")}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked: CheckedState) =>
                  onFiltersChange({ ...filters, inStock: checked === true })
                }
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={filters.onSale}
                onCheckedChange={(checked: CheckedState) =>
                  onFiltersChange({ ...filters, onSale: checked === true })
                }
              />
              <Label htmlFor="on-sale" className="text-sm cursor-pointer">
                On Sale
              </Label>
            </div>
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
}
