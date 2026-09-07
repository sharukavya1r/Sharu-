import React, { useState } from 'react';
import {
  Cable,
  Zap,
  BatteryCharging,
  Headphones,
  Smartphone,
  ShieldCheck,
  Shield,
  Usb,
  Radio,
  Car,
  ArrowLeft,
  ShoppingBag,
  Star,
  Check,
} from 'lucide-react';
import { ProductItem } from '../types';
import { BEST_SELLING_PRODUCTS } from '../data';
import { ProductCard } from './ProductCard';

interface CategoriesViewProps {
  onBackToHome: () => void;
  onAddToCart: (product: ProductItem) => void;
  onSelectProduct?: (product: ProductItem) => void;
  recentlyAddedId: string | null;
  showToast: (msg: string) => void;
}

interface CategoryCard {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

export const CATEGORY_LIST: CategoryCard[] = [
  {
    id: 'cables',
    name: 'Cables & Chords',
    count: 14,
    icon: <Cable className="w-5 h-5 text-orange-500" />,
    description: 'Braided Type-C, Lightning & 100W PD cables',
    gradient: 'from-orange-50 to-amber-50',
  },
  {
    id: 'chargers',
    name: 'Fast Chargers & GaN',
    count: 18,
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    description: '20W to 65W GaN dual-port super chargers',
    gradient: 'from-amber-50 to-yellow-50',
  },
  {
    id: 'powerbanks',
    name: 'Power Banks',
    count: 9,
    icon: <BatteryCharging className="w-5 h-5 text-emerald-500" />,
    description: '10000mAh to 20000mAh 22.5W fast charge packs',
    gradient: 'from-emerald-50 to-teal-50',
  },
  {
    id: 'earphones',
    name: 'Wireless Audio & TWS',
    count: 12,
    icon: <Headphones className="w-5 h-5 text-blue-500" />,
    description: 'ENC noise cancelling earbuds & sports neckbands',
    gradient: 'from-blue-50 to-indigo-50',
  },
  {
    id: 'holders',
    name: 'Holders & Stands',
    count: 8,
    icon: <Smartphone className="w-5 h-5 text-purple-500" />,
    description: 'Foldable metal desk stands & 360° car mounts',
    gradient: 'from-purple-50 to-fuchsia-50',
  },
  {
    id: 'protectors',
    name: 'Screen Protectors',
    count: 22,
    icon: <ShieldCheck className="w-5 h-5 text-cyan-500" />,
    description: '9H hardness tempered glass with edge privacy',
    gradient: 'from-cyan-50 to-sky-50',
  },
  {
    id: 'cases',
    name: 'Cases & Covers',
    count: 31,
    icon: <Shield className="w-5 h-5 text-rose-500" />,
    description: 'MagSafe shockproof bumpers & vegan leather cases',
    gradient: 'from-rose-50 to-red-50',
  },
  {
    id: 'otg',
    name: 'OTG & USB Hubs',
    count: 7,
    icon: <Usb className="w-5 h-5 text-violet-500" />,
    description: 'High-speed Type-C to USB-A and multi-port hubs',
    gradient: 'from-violet-50 to-purple-50',
  },
  {
    id: 'wireless',
    name: 'Wireless Chargers',
    count: 6,
    icon: <Radio className="w-5 h-5 text-indigo-500" />,
    description: '15W Qi fast charging pads & 3-in-1 apple docks',
    gradient: 'from-indigo-50 to-blue-50',
  },
  {
    id: 'car',
    name: 'Car Accessories',
    count: 11,
    icon: <Car className="w-5 h-5 text-slate-600" />,
    description: 'Dual fast car chargers, FM transmitters & mounts',
    gradient: 'from-slate-50 to-gray-50',
  },
];

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  onBackToHome,
  onAddToCart,
  onSelectProduct,
  recentlyAddedId,
  showToast,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const selectedCategory = CATEGORY_LIST.find((c) => c.id === selectedCategoryId);

  // Filter products for the chosen category
  const filteredProducts = selectedCategoryId
    ? BEST_SELLING_PRODUCTS.filter((p) => p.category === selectedCategoryId)
    : [];

  return (
    <div className="p-4 space-y-4">
      {/* Section Heading / Active Category Bar */}
      {!selectedCategory ? (
        <div className="pt-0.5">
          <h2 className="text-base font-bold text-[#001f3f]">All Categories</h2>
          <p className="text-[11px] text-gray-400">
            10 curated mobile accessories categories
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className="p-1 -ml-1 text-gray-600 hover:text-gray-900 rounded-full cursor-pointer flex items-center gap-1"
              aria-label="Back to all categories"
            >
              <ArrowLeft className="w-4 h-4 text-[#001f3f]" />
              <span className="text-xs font-bold text-[#001f3f]">
                {selectedCategory.name}
              </span>
            </button>
            <span className="text-[11px] text-gray-400">
              • {filteredProducts.length} accessories
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className="text-xs font-bold text-[#FF8C00] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
      )}

      {/* If category selected: Show Category Products */}
      {selectedCategoryId && selectedCategory ? (
        <div className="space-y-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 w-full">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                  isAdded={recentlyAddedId === product.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center">
              <p className="text-xs text-gray-500 font-medium">
                No items currently in this category.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className="mt-3 px-3 py-1.5 bg-[#001f3f] text-white text-xs font-bold rounded-lg"
              >
                Back to All Categories
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Full 10 Category Cards */
        <div className="grid grid-cols-1 gap-2.5">
          {CATEGORY_LIST.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                showToast(`Viewing ${cat.name}`);
              }}
              className="bg-white rounded-xl p-3 border border-gray-100 hover:border-orange-200 shadow-sm flex items-center justify-between cursor-pointer transition-all hover:translate-x-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} border border-gray-100 flex items-center justify-center shrink-0 shadow-inner`}
                >
                  {cat.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#001f3f] group-hover:text-[#FF8C00] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[9px] font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      {cat.count} items
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#FF8C00] group-hover:bg-orange-50 transition-colors shrink-0 ml-2">
                →
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBackToHome}
          className="text-xs font-bold text-[#FF8C00] hover:underline cursor-pointer"
        >
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};
