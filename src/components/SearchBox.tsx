import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onSubmit?: () => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onClear,
  onSubmit,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="px-4 mt-2.5 shrink-0">
      <div
        id="search-bar-container"
        className="bg-gray-100 rounded-full flex items-center px-4 py-2.5 border border-gray-200 transition-all focus-within:bg-white focus-within:border-gray-300 relative"
      >
        <input
          id="input-search-accessories"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search accessories, cables..."
          className="bg-transparent text-sm w-full outline-none text-gray-700 placeholder-gray-400 pr-7 font-normal"
        />

        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 rounded-full"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-3.5 pointer-events-none text-gray-500">
            <Search className="w-[18px] h-[18px] stroke-[2] text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
};
