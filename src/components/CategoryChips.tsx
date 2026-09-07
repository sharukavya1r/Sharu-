import React from 'react';
import { CATEGORIES } from '../data';

interface CategoryChipsProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <section className="px-4 mt-3 shrink-0 select-none" aria-label="10 Categories">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-[#001f3f] uppercase tracking-wider">
          Categories
        </h3>
        {selectedCategoryId && (
          <button
            type="button"
            onClick={() => onSelectCategory(selectedCategoryId)}
            className="text-[11px] font-bold text-[#FF8C00] hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Horizontal scrollable category pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              id={`cat-chip-${category.id}`}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                isSelected
                  ? 'bg-[#001f3f] text-white border-[#001f3f] shadow-sm'
                  : 'bg-white text-[#001f3f] border-gray-200 hover:border-[#FF8C00] hover:text-[#FF8C00] shadow-2xs'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
};
