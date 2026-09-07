import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, SavedAddress } from '../types';
import { calculateDeliveryFee } from '../utils/delivery';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  selectedAddress?: SavedAddress | null;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  selectedAddress,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryCalc = calculateDeliveryFee(selectedAddress, totalPrice);
  const deliveryFee = deliveryCalc.fee;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer content constrained to mobile container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-w-[390px] mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF8C00]" />
                <h3 className="font-bold text-[#001f3f] text-base">
                  Your Basket ({totalItems})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="pt-3 first:pt-0 flex items-center gap-3"
                  >
                    <div className="w-14 h-14 bg-gray-50 rounded-xl p-1 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#001f3f] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[#FF8C00] font-bold text-xs mt-0.5">
                        ₹{item.product.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-1.5 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-[#001f3f] hover:bg-white"
                      >
                        {item.quantity === 1 ? (
                           <Trash2 className="w-3 h-3 text-red-500" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>
                      <span className="text-xs font-bold text-[#001f3f] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-[#001f3f] hover:bg-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Your basket is empty</p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl space-y-2">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#001f3f] text-sm">
                    ₹{totalPrice}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span>Delivery</span>
                    {!deliveryCalc.isFree && (
                      <span className="text-[10px] text-gray-400">
                        ({deliveryCalc.zone})
                      </span>
                    )}
                  </div>
                  {deliveryCalc.isFree ? (
                    <span className="font-bold text-emerald-600">FREE DELIVERY</span>
                  ) : (
                    <span className="font-semibold text-gray-800">
                      ₹{deliveryFee}
                    </span>
                  )}
                </div>

                {/* Free delivery threshold encouragement */}
                {!deliveryCalc.isFree && (
                  <div className="text-[10px] text-orange-700 bg-orange-50 border border-orange-200/60 px-2 py-1 rounded-lg text-center font-medium">
                    Add ₹{299 - totalPrice} more to get <span className="font-bold text-[#FF8C00]">FREE Delivery</span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200/80 pt-2 flex items-center justify-between">
                  <span className="font-bold text-[#001f3f] text-sm">Total</span>
                  <span className="font-extrabold text-[#001f3f] text-base">
                    ₹{grandTotal}
                  </span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-3 bg-[#FF8C00] hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors uppercase tracking-wider cursor-pointer mt-1"
                >
                  PROCEED TO CHECKOUT (₹{grandTotal})
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
