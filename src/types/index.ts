export interface Store {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  store_id: string;
  items: CartItem[];
  total: number;
  customer_name: string;
  customer_phone: string | null;
  customer_mode: 'local' | 'retirada';
  customer_notes: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
