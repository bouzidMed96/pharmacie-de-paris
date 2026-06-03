/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductCategory = 
  | "skincare" 
  | "haircare" 
  | "baby" 
  | "nutrition" 
  | "hygiene" 
  | "medication";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number;
  oldPrice?: number; // For discount display
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  prescriptionRequired: boolean;
  size: string; // e.g., "400ml", "60 gélules", "75ml"
  concern: string[]; // e.g. ["Dermatologique", "Hydratation", "Bio", "Anti-âge", "Fatigue", "Stress"]
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Prescription {
  id: string;
  fileName: string;
  uploadDate: string;
  status: "Valide" | "En attente de vérification" | "Refusé";
  imageUrl: string; 
  doctorName?: string;
  patientName?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  zipCode: string;
  city: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  deliveryMethod: "collect" | "delivery";
  shippingAddress?: ShippingAddress;
  storeLocation?: string;
  paymentMethod: "card" | "paypal" | "applepay";
  prescriptionId?: string;
  status: "En attente" | "En préparation" | "Prêt pour retrait" | "Expédié" | "Livré";
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: ShippingAddress;
  prescriptions: Prescription[];
  orders: Order[];
  isLoggedIn: boolean;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
