export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: 'outerwear' | 'tops' | 'bottoms' | 'accessories';
  images: [string, string]; // [primary, alternate]
  sizes: string[];
  colors: { name: string; hex: string }[];
  tag?: 'BESTSELLER' | 'LIMITED DROP' | 'RESTOCKED' | 'ARCHIVE';
  description: string;
  features: string[];
  fabric: string;
  weight: string;
  fit: string;
  inStock: boolean;
}

export interface CartItem {
  id: string; // `${product.id}-${size}-${color}`
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export type CategoryFilter = 'all' | 'outerwear' | 'tops' | 'bottoms' | 'accessories';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}
