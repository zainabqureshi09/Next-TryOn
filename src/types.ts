export type Product = {
  name: string;
  id: string;
  title?: string;
  price: number;
  frame?: string;
  sku?: string;
  image?: string | null;       // main product image
  overlayImage?: string | null;// transparent PNG for try-on
};
