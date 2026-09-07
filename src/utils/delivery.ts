import { SavedAddress } from '../types';

export interface DeliveryCalculation {
  fee: number;
  isFree: boolean;
  zone: string;
  distanceDescription: string;
  originalStandardFee: number;
}

/**
 * Standard Delivery Fee Calculator for QukeBasket Mobile Accessories
 *
 * Rules:
 * - Orders ₹299 and above: FREE DELIVERY (₹0)
 * - Same city / very nearby: ₹19
 * - Nearby PIN codes: ₹29
 * - Same state medium distance: ₹39
 * - Nearby states: ₹49
 * - Far states: ₹59
 * - Very remote: maximum ₹79
 *
 * Deterministic: The same address/PIN always produces the exact same charge.
 */
export function getStandardDeliveryFee(address?: SavedAddress | null): {
  fee: number;
  zone: string;
  distanceDescription: string;
} {
  if (!address || !address.pincode) {
    return {
      fee: 19,
      zone: 'Same city / very nearby',
      distanceDescription: '~10 km',
    };
  }

  const pin = address.pincode.trim().replace(/\D/g, '');
  const state = (address.state || '').toLowerCase().trim();
  const city = (address.city || '').toLowerCase().trim();

  // Validate 6-digit Indian PIN
  if (pin.length === 6) {
    const prefix2 = pin.substring(0, 2);
    const prefix3 = pin.substring(0, 3);

    // 1. Same City / Very Nearby (Bangalore central/urban: 560xxx)
    if (prefix3 === '560' || city.includes('bangalore') || city.includes('bengaluru')) {
      return {
        fee: 19,
        zone: 'Same city / very nearby',
        distanceDescription: '~10 km',
      };
    }

    // 2. Nearby PIN codes / Suburbs (Bengaluru Rural 561xxx, 562xxx)
    if (prefix3 === '561' || prefix3 === '562') {
      return {
        fee: 29,
        zone: 'Nearby PIN codes',
        distanceDescription: '~35 km',
      };
    }

    // 3. Same State, Medium Distance (Rest of Karnataka: 56xxxx - 59xxxx, or state=Karnataka)
    if (
      ['56', '57', '58', '59'].includes(prefix2) ||
      state.includes('karnataka')
    ) {
      return {
        fee: 39,
        zone: 'Same state medium distance',
        distanceDescription: '~250 km',
      };
    }

    // 4. Very Remote Locations (North East: 78, 79, J&K / Ladakh: 19, Andaman: 744, Sikkim: 737, Lakshadweep)
    const remotePrefixes2 = ['78', '79', '19'];
    const remotePrefixes3 = ['744', '737'];
    if (
      remotePrefixes2.includes(prefix2) ||
      remotePrefixes3.includes(prefix3) ||
      pin.startsWith('68255') ||
      [
        'assam',
        'meghalaya',
        'manipur',
        'mizoram',
        'nagaland',
        'tripura',
        'arunachal',
        'sikkim',
        'kashmir',
        'ladakh',
        'andaman',
      ].some((s) => state.includes(s))
    ) {
      return {
        fee: 79,
        zone: 'Very remote (maximum ₹79)',
        distanceDescription: '~2,100 km',
      };
    }

    // 5. Nearby States (Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Maharashtra, Goa)
    const nearbyPrefixes = [
      '60', '61', '62', '63', '64', // Tamil Nadu
      '67', '68', '69',             // Kerala
      '50', '51', '52', '53',       // Telangana / Andhra Pradesh
      '40', '41', '42', '43', '44', // Maharashtra & Goa
    ];
    if (
      nearbyPrefixes.includes(prefix2) ||
      ['tamil nadu', 'kerala', 'andhra pradesh', 'telangana', 'maharashtra', 'goa'].some((s) =>
        state.includes(s)
      )
    ) {
      return {
        fee: 49,
        zone: 'Nearby states',
        distanceDescription: '~480 km',
      };
    }

    // 6. Far States (Delhi-NCR, Gujarat, Rajasthan, MP, UP, WB, Bihar, Punjab, etc.)
    return {
      fee: 59,
      zone: 'Far states',
      distanceDescription: '~1,200 km',
    };
  }

  // Fallback if city/state indicates Karnataka or Bangalore
  if (state.includes('karnataka') || city.includes('bangalore') || city.includes('bengaluru')) {
    return {
      fee: 19,
      zone: 'Same city / very nearby',
      distanceDescription: '~10 km',
    };
  }

  return {
    fee: 49,
    zone: 'Nearby states',
    distanceDescription: '~480 km',
  };
}

export function calculateDeliveryFee(
  address?: SavedAddress | null,
  subtotal: number = 0
): DeliveryCalculation {
  const isFree = subtotal >= 299;
  const standard = getStandardDeliveryFee(address);

  // Guarantee: Maximum ₹79 for very remote, never exceeds ₹79
  const safeStandardFee = Math.min(standard.fee, 79);

  return {
    fee: isFree ? 0 : safeStandardFee,
    isFree,
    zone: standard.zone,
    distanceDescription: standard.distanceDescription,
    originalStandardFee: safeStandardFee,
  };
}
