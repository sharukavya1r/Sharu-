import heroAccessoriesImg from './assets/images/tech_hero_accessories_1788669483676.jpg';
import cableImg from './assets/images/cable_type_c_1788669499009.jpg';
import chargerImg from './assets/images/charger_adapter_1788669515816.jpg';
import earphonesImg from './assets/images/wired_earphones_1788669538273.jpg';
import powerBankImg from './assets/images/power_bank_1788669551401.jpg';
import { CategoryItem, ProductItem } from './types';

export const HERO_BANNER = {
  titleLine1: 'Upgrade Your',
  titleLine2: 'Tech Life',
  ctaText: 'Shop Now',
  image: heroAccessoriesImg,
};

export const CATEGORIES: CategoryItem[] = [
  { id: 'cables', name: 'Cables', icon: 'cable' },
  { id: 'chargers', name: 'Chargers', icon: 'charger' },
  { id: 'earphones', name: 'Earphones', icon: 'earphones' },
  { id: 'power-banks', name: 'Power Banks', icon: 'powerbank' },
  { id: 'cases', name: 'Mobile Cases', icon: 'case' },
  { id: 'car-chargers', name: 'Car Chargers', icon: 'car-charger' },
  { id: 'screen-protectors', name: 'Screen Protectors', icon: 'screen-protector' },
  { id: 'memory-cards', name: 'Memory Cards', icon: 'memory-card' },
  { id: 'holders', name: 'Mobile Holders', icon: 'holder' },
  { id: 'more', name: 'More', icon: 'more' },
];

const caseImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23f8fafc"/><rect x="34" y="16" width="52" height="88" rx="10" fill="%23001f3f"/><rect x="40" y="24" width="40" height="72" rx="6" fill="%231e293b"/><rect x="42" y="26" width="18" height="20" rx="4" fill="%23FF8C00"/><circle cx="51" cy="36" r="4" fill="%23ffffff"/><circle cx="60" cy="60" r="14" stroke="%23FF8C00" stroke-width="2.5" stroke-dasharray="4 2"/></svg>`;

const carChargerImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23f8fafc"/><path d="M46 30h28l4 28h8a4 4 0 0 1 4 4v22a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V62a4 4 0 0 1 4-4h8l4-28z" fill="%23001f3f"/><rect x="55" y="20" width="10" height="10" rx="2" fill="%23FF8C00"/><rect x="46" y="70" width="12" height="7" rx="2" fill="%23ffffff"/><rect x="62" y="70" width="12" height="7" rx="2" fill="%23ffffff"/><circle cx="60" cy="85" r="2.5" fill="%23FF8C00"/></svg>`;

const screenProtectorImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23f8fafc"/><rect x="36" y="18" width="48" height="84" rx="8" fill="%23001f3f"/><rect x="32" y="16" width="52" height="84" rx="8" fill="%23ffffff" fill-opacity="0.85" stroke="%23FF8C00" stroke-width="2"/><path d="M40 80L80 36" stroke="%2338bdf8" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="74" r="12" fill="%23FF8C00"/><text x="70" y="78" text-anchor="middle" fill="%23ffffff" font-size="9" font-weight="bold" font-family="sans-serif">9H</text></svg>`;

const memoryCardImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23f8fafc"/><path d="M36 28a6 6 0 0 1 6-6h36a6 6 0 0 1 6 6v64a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6V54l-4-4v-16l4-4v-2z" fill="%23001f3f"/><rect x="44" y="26" width="5" height="12" rx="1.5" fill="%23FF8C00"/><rect x="52" y="26" width="5" height="12" rx="1.5" fill="%23FF8C00"/><rect x="60" y="26" width="5" height="12" rx="1.5" fill="%23FF8C00"/><rect x="68" y="26" width="5" height="12" rx="1.5" fill="%23FF8C00"/><text x="60" y="62" text-anchor="middle" fill="%23ffffff" font-size="11" font-weight="bold" font-family="sans-serif">MicroSD</text><text x="60" y="78" text-anchor="middle" fill="%23FF8C00" font-size="14" font-weight="bold" font-family="sans-serif">64GB</text></svg>`;

const holderImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23f8fafc"/><ellipse cx="60" cy="98" rx="34" ry="10" fill="%23001f3f"/><path d="M60 68v28" stroke="%23001f3f" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="64" r="8" fill="%23FF8C00"/><rect x="38" y="24" width="44" height="40" rx="6" fill="%23001f3f"/><rect x="44" y="28" width="32" height="32" rx="4" fill="%23ffffff"/><path d="M30 44h8M82 44h8" stroke="%23FF8C00" stroke-width="4" stroke-linecap="round"/></svg>`;

export const CABLE_PRODUCT_IMAGES: string[] = [
  'https://i.ibb.co/nNJ8wP5b/IMG-20260907-183147.jpg',
  'https://i.ibb.co/1fyHn1VW/IMG-20260907-183202.jpg',
  'https://i.ibb.co/DDyK07K1/IMG-20260907-183222.jpg',
  'https://i.ibb.co/670wCJ1L/IMG-20260907-183236.jpg',
  'https://i.ibb.co/zT50xpPv/IMG-20260907-183248.jpg',
  'https://i.ibb.co/yTN3Gj9/IMG-20260907-183311.jpg',
];

export const CABLE_DETAIL_IMAGES: string[] = [
  'https://i.ibb.co/hJYfzC5z/IMG-20260907-183515.jpg',
  'https://i.ibb.co/gLHJX0JQ/IMG-20260907-183502.jpg',
  'https://i.ibb.co/RGGF4LtX/IMG-20260907-183357.jpg',
  'https://i.ibb.co/JwYyq27L/IMG-20260907-183424.jpg',
  'https://i.ibb.co/LhHqbLCC/IMG-20260907-183341.jpg',
];

export const BEST_SELLING_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-cable-1',
    name: 'Type-C to Type-C Cable 3A',
    price: 199,
    originalPrice: 399,
    discountPercent: 50,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://i.ibb.co/nNJ8wP5b/IMG-20260907-183147.jpg',
    images: CABLE_DETAIL_IMAGES,
    category: 'cables',
    inStock: true,
    description: 'High-speed 3A Type-C to Type-C fast charging cable with 480 Mbps data synchronization. Built with high-durability braided fiber and reinforced connectors for universal smartphone and laptop compatibility.',
    specifications: {
      'Connector Type': 'USB Type-C to Type-C',
      'Output Current': '3A Max (Up to 60W Power Delivery)',
      'Cable Length': '1.0 Meter (3.3 ft)',
      'Data Transfer Rate': '480 Mbps',
      'Outer Material': 'Tangle-Free Double Braided Nylon',
      'Connector Shell': 'Anodized Aluminum Alloy',
      'Compatibility': 'Universal USB-C Smartphones, Tablets & Laptops',
    },
    warranty: '6 Months Replacement Warranty against manufacturing defects and connector failure. For warranty claims, contact support@qukebasket.in or 1800-QUKE-BASKET.',
    manufacturerInfo: {
      name: 'QukeBasket Technologies Private Limited',
      address: 'Indiranagar 100ft Road, Bangalore, Karnataka - 560038',
      countryOfOrigin: 'India',
      packer: 'Quke Fulfillment Hub, Electronic City, Bangalore - 560100',
    },
  },
  {
    id: 'prod-cable-2',
    name: 'Type-C to Type-C Cable 3A',
    price: 199,
    originalPrice: 399,
    discountPercent: 50,
    rating: 4.8,
    reviewCount: 128,
    image: 'https://i.ibb.co/1fyHn1VW/IMG-20260907-183202.jpg',
    category: 'cables',
    inStock: true,
    description: 'Ultra-durable fast charging 3A Type-C cable featuring reinforced strain-relief collars and copper core wiring for daily use.',
    specifications: {
      'Connector Type': 'Type-C to Type-C',
      'Current': '3.0A Fast Charge',
      'Cable Length': '1.2 Meters',
      'Material': 'Braided Cotton Fiber',
    },
    warranty: '6 Months QukeBasket Warranty against internal breakage.',
  },
  {
    id: 'prod-cable-3',
    name: 'Type-C to Type-C Cable 3A',
    price: 199,
    originalPrice: 399,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 156,
    image: 'https://i.ibb.co/DDyK07K1/IMG-20260907-183222.jpg',
    category: 'cables',
    inStock: true,
  },
  {
    id: 'prod-cable-4',
    name: 'Type-C to Type-C Cable 3A',
    price: 199,
    originalPrice: 399,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 98,
    image: 'https://i.ibb.co/670wCJ1L/IMG-20260907-183236.jpg',
    category: 'cables',
    inStock: true,
  },
  {
    id: 'prod-cable-5',
    name: 'Type-C to Type-C Cable 3A',
    price: 199,
    originalPrice: 399,
    discountPercent: 50,
    rating: 4.8,
    reviewCount: 114,
    image: 'https://i.ibb.co/zT50xpPv/IMG-20260907-183248.jpg',
    category: 'cables',
    inStock: true,
  },
  {
    id: 'prod-cable-6',
    name: 'Type-C to Type-C Cable 3A',
    price: 199,
    originalPrice: 399,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 165,
    image: 'https://i.ibb.co/yTN3Gj9/IMG-20260907-183311.jpg',
    category: 'cables',
    inStock: true,
  },
];
