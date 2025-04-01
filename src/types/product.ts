export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  brand: string;
  imageUrl?: string;
  stock: number;
  featured: boolean;
}
