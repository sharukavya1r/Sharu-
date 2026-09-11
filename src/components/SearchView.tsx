import React, { useState } from 'react';
import { Search as SearchIcon, X, ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { ProductItem } from '../types';
import { BEST_SELLING_PRODUCTS } from '../data';
import { ProductCard } from './ProductCard';

interface SearchViewProps {
  onBackToHome: () => void;
  onAddToCart: (product: ProductItem) => void;
  onSelectProduct?: (product: ProductItem) => void;
  recentlyAddedId: string | null;
  showToast: (msg: string) => void;
}

const POPULAR_SEARCHES = [
  'Type-C Cable',
  'GaN Charger',
  '20000mAh Power Bank',
  'TWS Earbuds',
  'Car Mount',
  'Screen Guard',
];

export const SearchView: React.FC<SearchViewProps> = ({
  onBackToHome,
  onAddToCart,
  onSelectProduct,
  recentlyAddedId,
  showToast,
}) => {
  const [query, setQuery] = useState('');

  const filteredProducts = BEST_SELLING_PRODUCTS.filter((product) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 space-y-4">
      {/* Search Input Bar */}
      <div className="relative pt-0.5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <SearchIcon className="w-4 h-4 text-[#FF8C00]" />
        </div>
        <input
          type="text"
          autoFocus
          placeholder="Search chargers, cables, earbuds, power banks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-[#001f3f] placeholder-gray-400 focus:outline-none focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f] shadow-sm transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular Search Suggestions */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
          <Sparkles className="w-3 h-3 text-[#FF8C00]" />
          <span>Popular Searches</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQuery(tag);
                showToast(`Searching for "${tag}"`);
              }}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:border-orange-200 text-[#001f3f] text-[11px] font-medium rounded-lg border border-gray-200 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-bold text-[#001f3f]">
            {query.trim()
              ? `Results for "${query}" (${filteredProducts.length})`
              : `All Available Accessories (${filteredProducts.length})`}
          </span>
          {query.trim() && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#FF8C00] font-bold hover:underline cursor-pointer text-[11px]"
            >
              Clear Filter
            </button>
          )}
        </div>

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
            <p className="text-xs text-gray-500 font-bold">
              No accessories found matching "{query}"
            </p>
            <p className="text-[11px] text-gray-400 mt-1 mb-3">
              Try searching for "Cables", "Charger", "Power Bank", or "Earbuds".
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-3.5 py-1.5 bg-[#001f3f] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
