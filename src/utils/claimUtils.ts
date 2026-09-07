export const CLAIM_WINDOW_MS = 60 * 60 * 1000; // 1 hour (3600000 ms)

export interface ClaimWindowInfo {
  remainingMs: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedDeliveryTime: string;
  formattedRemaining: string;
}

export function getClaimWindowInfo(
  deliveredAt?: number,
  now: number = Date.now()
): ClaimWindowInfo {
  if (!deliveredAt) {
    return {
      remainingMs: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formattedDeliveryTime: 'Not yet delivered',
      formattedRemaining: 'Not applicable',
    };
  }

  const deadline = deliveredAt + CLAIM_WINDOW_MS;
  const remainingMs = deadline - now;
  const isExpired = remainingMs <= 0;

  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const dateObj = new Date(deliveredAt);
  const hours = dateObj.getHours();
  const mins = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const formattedDeliveryTime = `${dateObj.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })} at ${hours12}:${mins} ${ampm}`;

  let formattedRemaining = '';
  if (isExpired) {
    formattedRemaining = 'Expired (over 1 hour since delivery)';
  } else if (minutes > 0) {
    formattedRemaining = `${minutes} minute${minutes === 1 ? '' : 's'} ${seconds}s remaining`;
  } else {
    formattedRemaining = `${seconds}s remaining`;
  }

  return {
    remainingMs,
    minutes,
    seconds,
    isExpired,
    formattedDeliveryTime,
    formattedRemaining,
  };
}

// Realistic sample base64 / SVG images of damaged accessories for quick 1-tap testing
export const SAMPLE_EVIDENCE_PHOTOS = [
  {
    name: 'Frayed Cable Joint.jpg',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f1f5f9"><rect width="400" height="400" fill="%23f8fafc"/><rect x="40" y="40" width="320" height="320" rx="16" fill="%23e2e8f0" stroke="%23cbd5e1" stroke-width="2"/><circle cx="200" cy="180" r="100" fill="%23001f3f"/><path d="M160 140 L240 220" stroke="%23ef4444" stroke-width="12" stroke-linecap="round"/><path d="M150 170 L250 170" stroke="%23FF8C00" stroke-width="8" stroke-dasharray="10 5"/><text x="200" y="310" text-anchor="middle" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="14">Proof: Broken/Frayed Type-C Connector</text><text x="200" y="332" text-anchor="middle" fill="%23ef4444" font-family="sans-serif" font-weight="600" font-size="12">Internal Copper Wires Exposed</text></svg>`,
  },
  {
    name: 'Cracked Glass Packaging.jpg',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f1f5f9"><rect width="400" height="400" fill="%23f8fafc"/><rect x="40" y="40" width="320" height="320" rx="16" fill="%23e2e8f0" stroke="%23cbd5e1" stroke-width="2"/><rect x="130" y="80" width="140" height="220" rx="8" fill="%23ffffff" stroke="%23001f3f" stroke-width="4"/><path d="M140 100 L210 180 L180 230 L260 280" stroke="%23ef4444" stroke-width="4" fill="none"/><path d="M210 180 L250 140" stroke="%23ef4444" stroke-width="3" fill="none"/><text x="200" y="325" text-anchor="middle" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="14">Proof: Shattered Screen Protector in Transit</text></svg>`,
  },
  {
    name: 'Tampered Courier Box.jpg',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f1f5f9"><rect width="400" height="400" fill="%23fef2f2"/><rect x="40" y="40" width="320" height="320" rx="16" fill="%23fee2e2" stroke="%23f87171" stroke-width="2"/><path d="M120 120 L280 120 L280 260 L120 260 Z" fill="%23b45309"/><path d="M120 150 L280 230" stroke="%23dc2626" stroke-width="8" stroke-dasharray="8 6"/><text x="200" y="305" text-anchor="middle" fill="%23991b1b" font-family="sans-serif" font-weight="bold" font-size="14">Proof: Crushed Outer Carton & Broken Seal</text></svg>`,
  },
];
