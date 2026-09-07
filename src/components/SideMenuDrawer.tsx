import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Info,
  FileText,
  Lock,
  RotateCcw,
  Truck,
  PhoneCall,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (id: string) => void;
}

interface PolicyDetail {
  title: string;
  subtitle?: string;
  paragraphs: string[];
}

const POLICY_DATA: Record<string, PolicyDetail> = {
  highlights: {
    title: 'Highlights',
    subtitle: 'Why Customers Trust QukeBasket',
    paragraphs: [
      '⚡ Express 24–48h Dispatch: Orders are securely packed in tamper-proof bubble polybags and dispatched from regional fulfillment hubs within 12 hours.',
      '🛡️ 100% Authentic Products: Guaranteed brand-new, genuine mobile accessories sourced directly from authorized manufacturers and verified distributors.',
      '🔄 1-Hour Damage Claim Guarantee: Any transit damage, broken item, or defect reported within 1 hour of delivery qualifies for an immediate doorstep replacement.',
      '🎧 24x7 Customer Support: Toll-free helpline, instant WhatsApp support, and round-the-clock claim verification for complete peace of mind.',
    ],
  },
  about: {
    title: 'About QukeBasket',
    subtitle: "India's Fast Mobile Accessories Store",
    paragraphs: [
      "QukeBasket is India's premier destination for genuine, high-performance smartphone accessories and digital lifestyle essentials.",
      'We curate authentic charging adapters, reinforced braided cables, high-capacity power banks, and studio-grade audio gear tested for durability, safety, and peak performance.',
      'With rapid dispatch from regional distribution hubs and 24–48 hour doorstep delivery, we ensure you stay connected anytime, anywhere.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Standard Consumer Terms & Usage Guidelines',
    paragraphs: [
      'All products listed on QukeBasket are 100% brand new, genuine, and sourced directly from authorized brand distributors.',
      'Listed prices are inclusive of all applicable taxes. Cash on Delivery and digital payment preferences are supported across 19,000+ Indian PIN codes.',
      'Products carry standard manufacturer warranty coverage. Invoices are provided digitally with every delivered order.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Security & Customer Data Protection',
    paragraphs: [
      'Your privacy and data safety are our top priorities. We employ industry-standard encryption protocols across all sessions and transactions.',
      'Your shipping address, phone number, and order details are strictly used for delivery fulfillment and live SMS/courier tracking.',
      'We never share, sell, or rent your personal information to third-party advertising or marketing services.',
    ],
  },
  refund: {
    title: 'Return & Refund Policy',
    subtitle: '1-Hour Damage Claim Window • Replacement Preferred',
    paragraphs: [
      'Strict 1-Hour Reporting Window: Customers must report any damaged, broken, defective, or wrong product within 1 hour of delivery with photo proof.',
      'Replacement Preferred: In accordance with our quality guarantee, standard resolution for verified claims is a brand-new doorstep replacement dispatched immediately.',
      'Claims Desk Verification: Uploaded photos (up to 5) and courier packaging are verified by our claims desk within 24 hours at zero additional cost.',
      'Refund Processing: In the rare event that a replacement unit is out of stock, a full refund is credited to your original payment method within 3–5 working days.',
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    subtitle: 'Express 24–48h Dispatch & Tracking',
    paragraphs: [
      'Orders are packed in tamper-proof bubble polybags and dispatched within 12 hours from our nearest fulfillment center.',
      'Express doorstep delivery takes 24 to 48 hours for metro and tier-1 locations, and 2 to 4 business days for all other pin codes.',
      'Free standard shipping applies automatically on all orders across India.',
    ],
  },
  support: {
    title: 'Toll-Free Support',
    subtitle: '1800-QUKE-BASKET (1800-7853-2275) • Available 24x7',
    paragraphs: [
      '📞 Toll-Free Helpline: Call 1800-7853-2275 anytime for immediate assistance regarding orders, tracking, and claims.',
      '⚡ 1-Hour Damage Claim Desk: Immediate priority verification for transit damages and replacement authorizations.',
      '✉️ Email Support: Reach our dedicated support desk at support@qukebasket.in with prompt responses within 2 hours.',
      '🕒 24x7 Assistance: Our customer support representatives are available around the clock to help you.',
    ],
  },
};

interface MenuItemConfig {
  key: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDE_MENU_ITEMS: MenuItemConfig[] = [
  {
    key: 'highlights',
    label: 'Highlights',
    sublabel: 'Free Express Delivery • Warranty • 24x7 Support',
    icon: Sparkles,
  },
  {
    key: 'about',
    label: 'About QukeBasket',
    sublabel: "India's Fast Mobile Accessories Store",
    icon: Info,
  },
  {
    key: 'terms',
    label: 'Terms & Conditions',
    sublabel: 'Consumer terms & guidelines',
    icon: FileText,
  },
  {
    key: 'privacy',
    label: 'Privacy Policy',
    sublabel: 'Security & customer data protection',
    icon: Lock,
  },
  {
    key: 'refund',
    label: 'Return & Refund Policy',
    sublabel: '1-Hour damage claim & replacement',
    icon: RotateCcw,
  },
  {
    key: 'shipping',
    label: 'Shipping Policy',
    sublabel: '24–48h express dispatch & tracking',
    icon: Truck,
  },
  {
    key: 'support',
    label: 'Toll-Free Support',
    sublabel: '1800-QUKE-BASKET (24x7 Helpline)',
    icon: PhoneCall,
  },
];

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activePolicyKey, setActivePolicyKey] = useState<string | null>(null);

  const handleCloseAll = () => {
    setActivePolicyKey(null);
    onClose();
  };

  const activePolicy = activePolicyKey ? POLICY_DATA[activePolicyKey] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (tapping outside closes the menu) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAll}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* If a menu item is tapped, show its detail panel */}
            {activePolicy ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Detail Header */}
                  <div className="bg-[#001f3f] text-white p-5 shrink-0">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActivePolicyKey(null)}
                        className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white font-semibold cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Menu</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseAll}
                        aria-label="Close drawer"
                        className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-sm font-black text-white mt-3.5">
                      {activePolicy.title}
                    </h3>
                    {activePolicy.subtitle && (
                      <p className="text-[11px] text-orange-200/90 mt-0.5 font-medium">
                        {activePolicy.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Detail Body */}
                  <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-210px)] text-xs text-gray-700 leading-relaxed">
                    {activePolicyKey === 'support' && (
                      <a
                        href="tel:180078532275"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-[#FF8C00] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer mb-2"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Call 1800-QUKE-BASKET Now</span>
                      </a>
                    )}

                    {activePolicy.paragraphs.map((para, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gray-50 border border-gray-100 rounded-xl"
                      >
                        <p>{para}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Back Button */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActivePolicyKey(null)}
                    className="w-full py-2.5 bg-[#001f3f] hover:bg-[#FF8C00] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    ← Back to Menu
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Side Menu View: EXACTLY 7 Items */
              <div className="flex flex-col h-full justify-between">
                <div className="overflow-y-auto">
                  {/* Top Branding Header */}
                  <div className="bg-[#001f3f] text-white p-5 shrink-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-baseline select-none">
                        <span className="text-white text-xl font-black tracking-tight">
                          Quke
                        </span>
                        <span className="text-[#FF8C00] text-xl font-black ml-0.5 tracking-tight">
                          Basket
                        </span>
                      </div>
                      <button
                        type="button"
                        id="side-menu-close-btn"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      India's Fast Mobile Accessories Store
                    </p>
                  </div>

                  {/* Exactly 7 Menu Items in Requested Order */}
                  <div className="p-3 space-y-1">
                    {SIDE_MENU_ITEMS.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          id={`side-menu-item-${item.key}`}
                          onClick={() => setActivePolicyKey(item.key)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50/70 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF8C00] flex items-center justify-center shrink-0 group-hover:bg-[#FF8C00] group-hover:text-white transition-colors">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-[#001f3f] group-hover:text-[#FF8C00] block truncate transition-colors">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-gray-400 block font-normal leading-tight mt-0.5 truncate">
                                {item.sublabel}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF8C00] transition-colors shrink-0 ml-1.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Brand Credit */}
                <div className="p-3.5 border-t border-gray-100 bg-gray-50 text-center shrink-0">
                  <p className="text-[10px] text-gray-400 font-medium">
                    QukeBasket Mobile Accessories © 2026
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
