export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface ManufacturerInfo {
  name?: string;
  address?: string;
  countryOfOrigin?: string;
  packer?: string;
  importer?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  images?: string[];
  category: string;
  inStock?: boolean;
  description?: string;
  specifications?: Record<string, string>;
  warranty?: string;
  manufacturerInfo?: ManufacturerInfo;
  reviews?: ProductReview[];
}

export type TabType = 'Home' | 'Categories' | 'Search' | 'Orders' | 'Profile';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  mobile: string;
  building: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type ClaimStatus =
  | 'Pending Review'
  | 'Under Review'
  | 'Approved – Replacement'
  | 'Approved – Refund'
  | 'Rejected'
  | 'Completed';

export type ClaimReason =
  | 'Product damaged'
  | 'Product broken'
  | 'Wrong product received'
  | 'Missing item'
  | 'Other issue';

export interface DamageClaim {
  id: string;
  orderId: string;
  createdAt: number;
  reason: ClaimReason;
  description: string;
  photos: string[];
  video?: string;
  videoName?: string;
  preferredResolution: 'Replacement preferred' | 'Refund requested';
  status: ClaimStatus;
  adminNotes?: string;
  updatedAt?: number;
  reviewedAt?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  createdAt?: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'Order Placed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  paymentMethod: string;
  deliveryAddress: SavedAddress;
  estimatedDelivery: string;
  deliveredAt?: number;
  deliveredDateFormatted?: string;
  damageClaim?: DamageClaim;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
}

