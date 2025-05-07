// Extended types for frontend use
import { 
  Product, 
  Category, 
  CartItem, 
  Testimonial, 
  Order 
} from "@shared/schema";

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface NavigationItem {
  name: string;
  slug: string;
  hasSubmenu: boolean;
  submenu?: {
    name: string;
    slug: string;
  }[];
}

export interface CustomerReview {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  bikeModel: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  sameAsBilling: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}
