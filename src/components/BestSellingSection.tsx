import React from 'react';
import { ProductItem } from '../types';
import { ProductCard } from './ProductCard';

interface BestSellingSectionProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onSelectProduct?: (product: ProductItem) => void;
  onViewAll: () => void;
  addedProductId?: string | null;
  activeFilterName?: string | null;
  onResetFilter?: () => void;
}

export const BestSellingSection: React.FC<BestSellingSectionProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
  onViewAll,
  addedProductId,
  activeFilterName,
  onResetFilter,
}) => {
  return (
    <section className="px-4 mt-6 pb-6 shrink-0" aria-label="Best Selling Products">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[#001f3f] font-bold text-base">
            {activeFilterName ? `${activeFilterName}` : 'Best Selling'}
          </h3>
          {activeFilterName && onResetFilter && (
            <button
              onClick={onResetFilter}
              className="text-[11px] text-gray-500 hover:text-[#FF8C00] underline font-medium"
            >
              Reset
            </button>
          )}
        </div>

        <button
          id="btn-view-all-bestselling"
          onClick={onViewAll}
          className="text-[#FF8C00] text-[11px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
        >
          View All &gt;
        </button>
      </div>

      {/* Product Grid - 2 COLUMNS ONLY with vertical scrolling */}
      {products.length > 0 ? (
        <div
          id="best-selling-viewport"
          className="max-h-[380px] overflow-y-auto pr-1 custom-scrollbar"
        >
          <div
            id="best-selling-grid"
            className="grid grid-cols-2 gap-3 w-full"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
                isAdded={addedProductId === product.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">No accessories found matching your filter.</p>
          {onResetFilter && (
            <button
              onClick={onResetFilter}
              className="text-xs font-semibold bg-[#001f3f] text-white px-3 py-1.5 rounded-lg"
            >
              Show All Best Selling
            </button>
          )}
        </div>
      )}
    </section>
  );
};
