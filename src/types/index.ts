export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'client' | 'merchant' | 'driver' | 'admin';
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface Store {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  address: Address;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingHours: OpeningHours[];
  categories: string[];
  deliveryFee: number;
  minOrderAmount: number;
  estimatedDeliveryTime: string;
  createdAt: string;
}

export interface OpeningHours {
  day: number;
  open: string;
  close: string;
}

export interface Product {
  id: string;
  _id?: string;

  storeId?: string;
  store?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  options?: ProductOption[];
  createdAt: string;
}

export interface ProductOption {
  id: string;
  name: string;
  required: boolean;
  maxSelections?: number;
  choices: ProductOptionChoice[];
}

export interface ProductOptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: SelectedOption[];
  totalPrice: number;
}

export interface SelectedOption {
  optionId: string;
  choiceIds: string[];
}

export interface Order {
  id: string;
  _id?: string;

  userId: string;
  user?: User;

  storeId?: string;
  store?: Store | string;
  items: OrderItem[];
  status: OrderStatus;
  deliveryAddress: Address;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  driverId?: string;
  driver?: Driver;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
export interface OrderItem {
  productId?: string;
  product?: string;

  productName?: string;
  name?: string;

  quantity: number;

  unitPrice?: number;
  price?: number;

  totalPrice?: number;

  selectedOptions?: SelectedOption[];

  options?: unknown[];
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'card' | 'cash' | 'wallet';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Driver {
  id: string;
  userId: string;
  user?: User;
  vehicleType: 'bike' | 'scooter' | 'car';
  licensePlate?: string;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  totalDeliveries: number;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  storeId?: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}