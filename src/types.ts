export type Category = 
  | 'Nail Gun'
  | 'MAGNETIC DRILL'
  | 'DRILL MACHINE'
  | 'Wire Strip Machine'
  | 'Ring Saw'
  | 'Brushless Wall Slot Machine'
  | 'Brushless Angle Grinder'
  | 'Diamond Core Drill'
  | 'Diamond Core Drill Bit'
  | 'Seam Locker'
  | 'ANNULAR CUTTER'
  | 'Cold Metal Saw'
  | 'Magnetic Chip Collector'
  | 'Plastic Crusher Machine'
  | 'Air Compressor'
  | 'Others';

export interface Product {
  id: string;
  name: {
    en: string;
    pt: string;
  };
  slug: string;
  category: Category;
  rentalPrice: number; // €/day
  servicePrice?: number; // € for "turnkey"
  description: {
    en: string;
    pt: string;
  };
  shortDescription: {
    en: string;
    pt: string;
  };
  specifications: {
    key: string;
    value: string;
  }[];
  images: string[];
  inStock: boolean;
  status: 'available' | 'rented' | 'maintenance';
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
  startDate?: string;
  endDate?: string;
}

export interface Booking {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: number;
  startDate: string;
  endDate: string;
}

export type Language = 'en' | 'pt';
