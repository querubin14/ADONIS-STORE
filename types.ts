export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  type?: 'clothing' | 'footwear'; // New field for Type Selector
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  fit?: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean; // Featured in Home "Destacados"
  isCategoryFeatured?: boolean; // Featured within its specific category
  description?: string;
  stock?: number;
  inventory?: InventoryItem[];
  costPrice?: number;
}

export interface InventoryItem {
  id?: string;
  product_id?: string;
  size: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  subcategories?: string[];
  opacity?: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
  image: string;
  mobilePosition?: string; // e.g. "center top"
  desktopPosition?: string; // e.g. "center center"
}


export interface Order {
  id: string; // UUID
  display_id: number; // #1024
  product_ids: string[]; // Array of SVG IDs
  status: 'Pendiente' | 'Confirmado en Mercado' | 'En Camino' | 'Entregado';
  supplier_info?: string;
  payment_method?: 'Efectivo' | 'QR' | 'Transferencia';
  total_amount: number;
  delivery_cost: number;
  created_at?: string;
  customerInfo?: {
    name?: string;
    phone?: string;
    location?: {
      lat: number;
      lng: number;
    }
  };
  // Optional expanded items for UI (fetched separately or joined)
  items?: Product[];
}

export interface SocialConfig {
  instagram: string;
  tiktok: string;
  facebook?: string;
  email: string;
  whatsapp: string;
  address?: string;
  shippingText?: string;
  extraShippingInfo?: string;
  topHeaderText?: string;
  favicon?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  content?: string; // made optional as it's not present in constants.tsx
  author?: string; // made optional
  date?: string; // made optional
  rating?: number;
  tags?: string[];
  tag?: string;
  linkText?: string;
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
  points: { lat: number; lng: number }[]; // Polygon coordinates
  color: string;
}

// Point in Polygon Algorithm (Ray Casting)
export const isPointInPolygon = (point: { lat: number, lng: number }, vs: { lat: number, lng: number }[]) => {
  // ray-casting algorithm based on
  // https://github.com/substack/point-in-polygon
  const x = point.lat, y = point.lng;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].lat, yi = vs[i].lng;
    const xj = vs[j].lat, yj = vs[j].lng;

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export interface NavbarLink {
  id: string;
  label: string;
  path: string;
  subcategories?: string[];
}

export interface BannerBento {
  id: string; // 'large', 'top_right', 'bottom_right'
  title: string;
  subtitle?: string;
  buttonText?: string;
  image: string;
  link: string;
}

export interface HeroCarouselConfig {
  interval: number; // milliseconds
}

export interface LifestyleConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  buttonText: string;
  buttonLink: string;
}
export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface Drop {
  id: string;
  title?: string;
  image: string;
  created_at?: string;
}

export interface DropsConfig {
  isEnabled: boolean;
}
