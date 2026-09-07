import React from 'react';
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, FileText, Lock, Info, CheckCircle2, PhoneCall } from 'lucide-react';

export type PolicyKey = 'about' | 'terms' | 'privacy' | 'refund' | 'shipping';

interface PolicySection {
  heading: string;
  body: string;
}

interface PolicyContent {
  title: string;
  tagline: string;
  icon: React.ReactNode;
  lastUpdated: string;
  sections: PolicySection[];
}

export const POLICIES: Record<PolicyKey, PolicyContent> = {
  about: {
    title: 'About QukeBasket',
    tagline: "India's Fast Mobile Accessories Store",
    icon: <Info className="w-5 h-5 text-[#FF8C00]" />,
    lastUpdated: 'September 2026',
    sections: [
      {
        heading: 'Our Mission',
        body: 'QukeBasket was founded with a singular commitment: to make certified, durable, and genuine smartphone accessories accessible across all corners of India at honest prices with lightning-fast delivery.',
      },
      {
        heading: 'Curated Quality & Brand Integrity',
        body: 'Every cable, high-wattage GaN charger, ultra-durable power bank, and audio accessory on QukeBasket undergoes rigorous quality checks. We work exclusively with certified manufacturers to guarantee optimal charging efficiency and device safety.',
      },
      {
        heading: 'Pan-India Express Fulfillment',
        body: 'Operating through multi-city fulfillment centers, all orders placed before 4 PM are packed in tamper-proof packaging and dispatched the same day, reaching metro doorsteps in 24 to 48 hours.',
      },
      {
        heading: 'Customer First Philosophy',
        body: 'We back every product with a genuine 100% manufacturer warranty, a 7-day hassle-free replacement promise, and dedicated 24x7 toll-free support.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    tagline: 'Customer Agreement & Usage Guidelines',
    icon: <FileText className="w-5 h-5 text-[#FF8C00]" />,
    lastUpdated: 'September 2026',
    sections: [
      {
        heading: '1. Agreement to Terms',
        body: 'By accessing or placing an order on QukeBasket, you agree to be bound by these Terms and Conditions and our associated operational guidelines.',
      },
      {
        heading: '2. Authenticity & Warranty',
        body: 'All products sold on QukeBasket are brand new and guaranteed 100% authentic. Standard brand warranty terms apply from the delivery date, backed by authorized repair or replacement policies.',
      },
      {
        heading: '3. Pricing & Taxes',
        body: 'All product prices displayed are inclusive of GST and all applicable statutory levies. While we strive for price precision, any inadvertent system pricing error will be verified and communicated prior to dispatch.',
      },
      {
        heading: '4. Cash on Delivery & Digital Payments',
        body: 'Cash on Delivery (COD) and UPI upon delivery are supported across 19,000+ Indian postal codes. Customers are requested to inspect the intact tamper-evident seal before accepting the delivery.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    tagline: 'Data Security & Customer Confidentiality',
    icon: <Lock className="w-5 h-5 text-[#FF8C00]" />,
    lastUpdated: 'September 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect minimal contact information necessary for order fulfillment, including your name, delivery address, phone number, and postal code. We never store credit card or banking credentials.',
      },
      {
        heading: '2. Purpose of Use',
        body: 'Your data is strictly utilized to process, dispatch, and track your orders, send SMS/WhatsApp delivery updates, and provide personalized customer support.',
      },
      {
        heading: '3. Data Security & Storage',
        body: 'Customer account information and delivery addresses are encrypted and stored securely. We do not sell, rent, or lease customer data to third-party advertisers.',
      },
      {
        heading: '4. Your Data Rights',
        body: 'You may view, modify, or delete your saved delivery addresses anytime via the "Saved Addresses" section in My Account.',
      },
    ],
  },
  refund: {
    title: 'Return & Damage Claim Policy',
    tagline: '1-Hour Damage Claim Window • Replacement Preferred',
    icon: <RotateCcw className="w-5 h-5 text-[#FF8C00]" />,
    lastUpdated: 'September 2026',
    sections: [
      {
        heading: '1. Strict 1-Hour Damage Claim Reporting Window',
        body: 'Customers must report any damaged, broken, defective, or wrong product within 1 HOUR of delivery. The 1-hour countdown timer starts automatically from the verified order delivery time. Once 1 hour has elapsed, the claim submission window closes permanently.',
      },
      {
        heading: '2. Proof & Verification Requirements',
        body: 'To prevent fraudulent claims, customers must upload clear photos (up to 5) of the damaged item and original courier packaging. An optional short video can also be provided. All claims enter "Under Review" status for claims desk verification before any action is approved.',
      },
      {
        heading: '3. Default Resolution: Replacement Preferred',
        body: 'In accordance with our quality guarantee, the standard resolution for verified transit damages is a brand-new doorstep replacement dispatched immediately. Refunds are not automatically approved and are only issued when replacement stock is unavailable or specifically authorized by admin.',
      },
      {
        heading: '4. Claim Review & Turnaround',
        body: 'Our claims desk verifies uploaded photo/video proof within 24 hours. Once approved (Status: "Approved – Replacement"), reverse pickup of the defective unit and doorstep dispatch of the new unit are initiated with zero extra fee.',
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    tagline: 'Express 24–48 Hour Pan-India Delivery',
    icon: <Truck className="w-5 h-5 text-[#FF8C00]" />,
    lastUpdated: 'September 2026',
    sections: [
      {
        heading: '1. Fast 12-Hour Dispatch',
        body: 'All orders confirmed on QukeBasket are processed and dispatched within 12 business hours from our nearest regional hub.',
      },
      {
        heading: '2. Transit Timelines',
        body: 'Metro cities (Bangalore, Mumbai, Delhi-NCR, Chennai, Hyderabad, Kolkata) receive delivery within 24 to 48 hours. Tier-2 and Tier-3 locations take 2 to 4 working days.',
      },
      {
        heading: '3. Reduced Shipping Rates & Free Delivery',
        body: 'Orders of ₹299 and above qualify for 100% Free Express Delivery across India. For orders below ₹299, reduced and affordable distance-based delivery charges apply (₹19–₹23 for same city/nearby, ₹29–₹34 for nearby PIN codes, ₹42 for same state, ₹52 for nearby states, ₹63 for far states, and max ₹89–₹90 for remote locations, never exceeding ₹95).',
      },
      {
        heading: '4. Live Tracking',
        body: 'Immediately upon dispatch, you will receive an SMS and WhatsApp alert containing your courier tracking number and real-time transit link.',
      },
    ],
  },
};

interface PolicyDetailViewProps {
  policyKey: PolicyKey;
  onBack: () => void;
}

export const PolicyDetailView: React.FC<PolicyDetailViewProps> = ({
  policyKey,
  onBack,
}) => {
  const policy = POLICIES[policyKey];

  if (!policy) return null;

  return (
    <div className="min-h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#001f3f] text-white p-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white font-semibold cursor-pointer p-1 -ml-1 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <span className="text-[10px] text-orange-300 font-bold bg-white/10 px-2 py-0.5 rounded-full">
            {policy.lastUpdated}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            {policy.icon}
          </div>
          <div>
            <h2 className="text-sm font-black text-white">{policy.title}</h2>
            <p className="text-[11px] text-orange-200 font-medium">
              {policy.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
        {policy.sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1 shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#001f3f]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8C00] shrink-0" />
              <h4>{sec.heading}</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pl-5">
              {sec.body}
            </p>
          </div>
        ))}

        {/* Contact info card */}
        <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3 text-xs text-[#001f3f] flex items-center justify-between mt-4">
          <div>
            <p className="font-bold">Need assistance regarding this policy?</p>
            <p className="text-[11px] text-gray-500">
              Our 24x7 desk is ready to answer questions.
            </p>
          </div>
          <a
            href="tel:180078532275"
            className="px-2.5 py-1.5 bg-[#001f3f] hover:bg-[#FF8C00] text-white text-[11px] font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3 text-orange-300" />
            <span>Support</span>
          </a>
        </div>
      </div>

      {/* Footer Return Button */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2.5 bg-[#001f3f] hover:bg-[#FF8C00] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm text-center"
        >
          ← Return to Previous Page
        </button>
      </div>
    </div>
  );
};
