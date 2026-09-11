import React from 'react';
import { Menu, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  cartCount: number;
  onOpenMenu: () => void;
  onOpenCart: () => void;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  onLogoClick?: () => void;
  showCart?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenMenu,
  onOpenCart,
  showBack,
  onBack,
  title,
  onLogoClick,
  showCart = true,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 shrink-0">
      {/* Left: Back Arrow or Hamburger Icon */}
      {showBack && onBack ? (
        <button
          id="btn-header-back"
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#001f3f] hover:bg-gray-100 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5] text-[#001f3f]" />
        </button>
      ) : (
        <button
          id="btn-header-menu"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#001f3f] hover:bg-gray-100 active:scale-95 transition-transform cursor-pointer"
        >
          <Menu className="w-6 h-6 stroke-[2] text-[#001f3f]" />
        </button>
      )}

      {/* Center: Brand Logo or Page Title */}
      <div
        id="brand-logo"
        onClick={onLogoClick}
        className="flex items-center gap-1 cursor-pointer select-none"
      >
        {title ? (
          <h2 className="text-base font-extrabold text-[#001f3f] tracking-tight truncate max-w-[190px]">
            {title}
          </h2>
        ) : (
          <div className="text-xl font-extrabold flex items-center tracking-tight">
            <span className="text-[#001f3f]">Quke</span>
            <span className="text-[#FF8C00]">Basket</span>
          </div>
        )}
      </div>

      {/* Right: Cart Icon with Badge or Spacer */}
      {showCart ? (
        <motion.button
          id="btn-header-cart"
          onClick={onOpenCart}
          whileTap={{ scale: 0.92 }}
          aria-label={`Shopping cart with ${cartCount} items`}
          className="relative w-9 h-9 -mr-1.5 rounded-full flex items-center justify-center text-[#001f3f] hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-5.5 h-5.5 stroke-[1.75] text-[#001f3f]" />
          
          {/* Orange notification badge */}
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="absolute top-0.5 right-0.5 bg-[#FF8C00] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow-xs pointer-events-none leading-none"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ) : (
        <div className="w-9 h-9" />
      )}
    </header>
  );
};
