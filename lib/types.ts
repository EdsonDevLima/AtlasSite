export type OrderStatus = "pending" | "completed" | "cancelled" | "refunded";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  amount: number;
  status: string;
  isPromotion?: boolean;
  image?: string | null;
  createdAt?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  role?: string;
  password?: string;
  adress?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    zip?: string;
  };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface Order {
  id: number;
  created_at: string;
  total: string | number;
  status: OrderStatus;
  trackingCode?: string;
  user: Customer;
  products: Product[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface RegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf?: string;
  addresses: Array<{
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  }>;
}
