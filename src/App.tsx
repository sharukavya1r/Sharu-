import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { Header } from './components/Header';
import { SearchBox } from './components/SearchBox';
import { HeroBanner } from './components/HeroBanner';
import { CategoryChips } from './components/CategoryChips';
import { BestSellingSection } from './components/BestSellingSection';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { ProfileView } from './components/ProfileView';
import { CategoriesView } from './components/CategoriesView';
import { SearchView } from './components/SearchView';
import { OrdersView } from './components/OrdersView';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Toast } from './components/Toast';
import { BEST_SELLING_PRODUCTS, CATEGORIES } from './data';
import { TabType, ProductItem, CartItem, SavedAddress, Order } from './types';

const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Rahul Sharma',
    mobile: '9876543210',
    building: 'Flat 402, Sunshine Heights',
    street: '100ft Road, Indiranagar',
    landmark: 'Near Indiranagar Metro Station',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    isDefault: true,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'QK-94021',
    date: 'Today, 1:45 PM',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    items: [
      {
        id: BEST_SELLING_PRODUCTS[0].id,
        name: BEST_SELLING_PRODUCTS[0].name,
        price: BEST_SELLING_PRODUCTS[0].price,
        image: BEST_SELLING_PRODUCTS[0].image,
        quantity: 2,
      },
    ],
    totalAmount: 398,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    deliveryAddress: INITIAL_ADDRESSES[0],
    estimatedDelivery: 'Today by 2:00 PM',
    deliveredAt: Date.now() - 18 * 60 * 1000, // Delivered 18 mins ago (42m window left)
    deliveredDateFormatted: 'Today, 1:45 PM',
  },
  {
    id: 'QK-88152',
    date: 'Today, 1:20 PM',
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    items: [
      {
        id: BEST_SELLING_PRODUCTS[0].id,
        name: BEST_SELLING_PRODUCTS[0].name,
        price: BEST_SELLING_PRODUCTS[0].price,
        image: BEST_SELLING_PRODUCTS[0].image,
        quantity: 1,
      },
    ],
    totalAmount: 199,
    status: 'Delivered',
    paymentMethod: 'Doorstep UPI QR',
    deliveryAddress: INITIAL_ADDRESSES[0],
    estimatedDelivery: 'Today by 1:30 PM',
    deliveredAt: Date.now() - 35 * 60 * 1000,
    deliveredDateFormatted: 'Today, 1:20 PM',
    damageClaim: {
      id: 'CLM-748192',
      orderId: 'QK-88152',
      createdAt: Date.now() - 15 * 60 * 1000,
      reason: 'Product broken',
      description: 'One braided cable end was loose and not charging phone. Packaging intact.',
      photos: [
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f1f5f9"><rect width="400" height="400" fill="%23f8fafc"/><rect x="40" y="40" width="320" height="320" rx="16" fill="%23e2e8f0" stroke="%23cbd5e1" stroke-width="2"/><circle cx="200" cy="180" r="100" fill="%23001f3f"/><path d="M160 140 L240 220" stroke="%23ef4444" stroke-width="12" stroke-linecap="round"/><path d="M150 170 L250 170" stroke="%23FF8C00" stroke-width="8" stroke-dasharray="10 5"/><text x="200" y="310" text-anchor="middle" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="14">Proof: Broken Type-C Connector</text></svg>`,
      ],
      preferredResolution: 'Replacement preferred',
      status: 'Under Review',
      adminNotes: 'Proof received. Bangalore hub dispatched technician verification.',
    },
  },
  {
    id: 'QK-78219',
    date: 'Yesterday, 4:20 PM',
    items: [
      {
        id: BEST_SELLING_PRODUCTS[0].id,
        name: BEST_SELLING_PRODUCTS[0].name,
        price: BEST_SELLING_PRODUCTS[0].price,
        image: BEST_SELLING_PRODUCTS[0].image,
        quantity: 1,
      },
    ],
    totalAmount: 199,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    deliveryAddress: INITIAL_ADDRESSES[0],
    estimatedDelivery: 'Yesterday, 6:30 PM',
    deliveredAt: Date.now() - 26 * 60 * 60 * 1000, // Delivered > 24 hours ago (Expired)
    deliveredDateFormatted: 'Yesterday, 4:20 PM',
  },
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('Home');

  // Search State for Home
  const [searchQuery, setSearchQuery] = useState('');

  // Category Selection Filter State for Home
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Persistent Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem('quke_saved_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_ADDRESSES;
  });

  // Persistent Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('quke_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if any delivered order has an active 1-hour window
          const hasActive = parsed.some(
            (o) =>
              o.status === 'Delivered' &&
              o.deliveredAt &&
              Date.now() - o.deliveredAt < 3600000
          );
          if (!hasActive) {
            return [INITIAL_ORDERS[0], ...parsed.filter((o) => o.id !== 'QK-94021')];
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ORDERS;
  });

  // Persistent COD Selection State
  const [isCodSelected, setIsCodSelected] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('quke_cod_selected');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Initial cart items
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('quke_cart_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item) => item && item.product && item.product.id && item.product.price && item.quantity > 0
          );
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // Fallback
    }
    return [
      { product: BEST_SELLING_PRODUCTS[0], quantity: 2 },
    ];
  });

  // Sync Cart Items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quke_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync Orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quke_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Sync Saved Addresses to localStorage
  const handleUpdateAddresses = (newAddresses: SavedAddress[]) => {
    setSavedAddresses(newAddresses);
    try {
      localStorage.setItem('quke_saved_addresses', JSON.stringify(newAddresses));
    } catch (e) {
      console.error(e);
    }
  };

  // Drawer / Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart count calculation
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Filter products based on search or category on Home
  const filteredProducts = useMemo(() => {
    let list = BEST_SELLING_PRODUCTS;

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Category name for active filter header
  const activeCategoryName = useMemo(() => {
    if (!selectedCategory) return null;
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    return cat ? cat.name : null;
  }, [selectedCategory]);

  // Handlers
  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
    showToast(`Added "${product.name}" to Basket!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from basket');
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'more') {
      setIsMenuOpen(true);
      return;
    }

    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      showToast('Showing all accessories');
    } else {
      setSelectedCategory(categoryId);
      const cat = CATEGORIES.find((c) => c.id === categoryId);
      showToast(`Showing ${cat?.name || 'Category'}`);
    }

    const el = document.getElementById('best-selling-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleShopNow = (categoryId?: string) => {
    setSearchQuery('');
    if (categoryId) {
      setSelectedCategory(categoryId);
      const cat = CATEGORIES.find((c) => c.id === categoryId);
      showToast(`Browsing ${cat?.name || 'Category'}!`);
    } else {
      setSelectedCategory(null);
      showToast('Browsing Best Selling tech accessories!');
    }
    const el = document.getElementById('best-selling-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewAll = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    showToast('Viewing all Best Selling products');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'Search') {
      const input = document.getElementById('input-search-accessories');
      input?.focus();
    }
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Browser back navigation support
  useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct) {
        setSelectedProduct(null);
      } else if (isCheckoutOpen) {
        setIsCheckoutOpen(false);
      } else if (isCartOpen) {
        setIsCartOpen(false);
      } else if (isMenuOpen) {
        setIsMenuOpen(false);
      } else if (activeTab !== 'Home') {
        setActiveTab('Home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProduct, isCheckoutOpen, isCartOpen, isMenuOpen, activeTab]);

  return (
    <div className="min-h-screen bg-[#e5e7eb] flex items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans">
      {/* 390px Max Width Mobile Frame */}
      <div
        id="qukebasket-mobile-container"
        className="w-full max-w-[390px] min-h-screen sm:h-[844px] bg-[#fcfcfc] shadow-2xl sm:rounded-[30px] overflow-hidden flex flex-col relative border-0 sm:border-[8px] sm:border-[#1e293b]"
      >
        {/* Mobile Status Bar (Realistic Smartphone top bar) */}
        <div className="h-10 px-6 pt-2 pb-1 flex items-center justify-between text-[#001f3f] text-xs font-semibold select-none bg-white border-b border-gray-100">
          <span className="text-[13px] tracking-tight font-bold">9:41</span>
          
          {/* Dynamic Island pill */}
          <div className="hidden sm:block w-20 h-4 bg-black rounded-full mx-auto" />

          <div className="flex items-center gap-1.5 text-[#001f3f]">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Top Header */}
        <Header
          cartCount={totalCartCount}
          showBack={activeTab !== 'Home'}
          onBack={() => setActiveTab('Home')}
          onLogoClick={() => setActiveTab('Home')}
          title={
            activeTab === 'Orders'
              ? 'Your Orders'
              : activeTab === 'Profile'
              ? 'My Account'
              : activeTab === 'Categories'
              ? 'Categories'
              : activeTab === 'Search'
              ? 'Search'
              : undefined
          }
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-6">
          {activeTab === 'Orders' ? (
            /* Dedicated Orders View */
            <OrdersView
              orders={orders}
              onBackToShopping={() => setActiveTab('Home')}
              showToast={showToast}
              onUpdateOrder={(updated) => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === updated.id ? updated : o))
                );
              }}
            />
          ) : activeTab === 'Categories' ? (
            /* Dedicated Categories View */
            <CategoriesView
              onBackToHome={() => setActiveTab('Home')}
              onAddToCart={handleAddToCart}
              onSelectProduct={setSelectedProduct}
              recentlyAddedId={recentlyAddedId}
              showToast={showToast}
            />
          ) : activeTab === 'Search' ? (
            /* Dedicated Search View */
            <SearchView
              onBackToHome={() => setActiveTab('Home')}
              onAddToCart={handleAddToCart}
              onSelectProduct={setSelectedProduct}
              recentlyAddedId={recentlyAddedId}
              showToast={showToast}
            />
          ) : activeTab === 'Profile' ? (
            /* Profile / My Account View with exact 5 functional options */
            <ProfileView
              onBackToShopping={() => setActiveTab('Home')}
              showToast={showToast}
              onNavigateToTab={setActiveTab}
              addresses={savedAddresses}
              onUpdateAddresses={handleUpdateAddresses}
              isCodSelected={isCodSelected}
              onToggleCod={(selected) => {
                setIsCodSelected(selected);
                try {
                  localStorage.setItem('quke_cod_selected', JSON.stringify(selected));
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          ) : (
            /* Home / Catalog View */
            <>
              {/* Search Bar */}
              <SearchBox
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                onSubmit={() => {
                  const el = document.getElementById('best-selling-grid');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
              />

              {/* ONE Hero Carousel (10 Slides, Left/Right Swipe, Auto-slide) */}
              <HeroBanner onShopNow={handleShopNow} />

              {/* 10 Categories */}
              <CategoryChips
                selectedCategoryId={selectedCategory}
                onSelectCategory={handleCategoryClick}
              />

              {/* Best Selling Section */}
              <BestSellingSection
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onSelectProduct={setSelectedProduct}
                onViewAll={handleViewAll}
                addedProductId={recentlyAddedId}
                activeFilterName={
                  searchQuery
                    ? `Search: "${searchQuery}"`
                    : activeCategoryName
                    ? `${activeCategoryName}`
                    : null
                }
                onResetFilter={
                  selectedCategory || searchQuery
                    ? () => {
                        setSelectedCategory(null);
                        setSearchQuery('');
                      }
                    : undefined
                }
              />
            </>
          )}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Product Details Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductDetailsModal
              isOpen={true}
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              savedAddresses={savedAddresses}
              selectedAddress={savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null}
              onSelectAddress={(addr) => {
                const updated = savedAddresses.map((a) => ({
                  ...a,
                  isDefault: a.id === addr.id,
                }));
                handleUpdateAddresses(updated);
              }}
            />
          )}
        </AnimatePresence>

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          selectedAddress={savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          savedAddresses={savedAddresses}
          onUpdateAddresses={handleUpdateAddresses}
          isCodSelected={isCodSelected}
          onOrderPlaced={handleOrderPlaced}
          showToast={showToast}
        />

        {/* Side Menu Drawer (Hamburger Menu) */}
        <SideMenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setActiveTab('Home');
            showToast('Category filtered');
          }}
        />

        {/* Interactive Toast Notifications */}
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </div>
  );
}
