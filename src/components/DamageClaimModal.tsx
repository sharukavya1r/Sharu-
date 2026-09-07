import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  Upload,
  Camera,
  Video,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  FileCheck,
  RefreshCw,
  Eye,
  Trash2,
  Lock,
  ChevronRight,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Order,
  DamageClaim,
  ClaimStatus,
  ClaimReason,
} from '../types';
import {
  getClaimWindowInfo,
  SAMPLE_EVIDENCE_PHOTOS,
  CLAIM_WINDOW_MS,
} from '../utils/claimUtils';

interface DamageClaimModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  showToast: (msg: string) => void;
  initialAdminMode?: boolean;
}

const CLAIM_REASONS: ClaimReason[] = [
  'Product damaged',
  'Product broken',
  'Wrong product received',
  'Missing item',
  'Other issue',
];

const CLAIM_STATUSES: ClaimStatus[] = [
  'Pending Review',
  'Under Review',
  'Approved – Replacement',
  'Approved – Refund',
  'Rejected',
  'Completed',
];

export const DamageClaimModal: React.FC<DamageClaimModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrder,
  showToast,
  initialAdminMode = false,
}) => {
  // Real live ticking clock every 1 second
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form State
  const [selectedReason, setSelectedReason] = useState<ClaimReason>('Product damaged');
  const [description, setDescription] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoData, setVideoData] = useState<{ url: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Admin desk toggle
  const [isAdminMode, setIsAdminMode] = useState<boolean>(initialAdminMode);
  const [adminStatus, setAdminStatus] = useState<ClaimStatus>(
    order.damageClaim?.status || 'Under Review'
  );
  const [adminNotes, setAdminNotes] = useState<string>(
    order.damageClaim?.adminNotes || ''
  );

  // File input refs
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate live window info using order's deliveredAt timestamp
  const windowInfo = getClaimWindowInfo(order.deliveredAt, now);

  // Sync admin status if order changes
  useEffect(() => {
    if (order.damageClaim) {
      setAdminStatus(order.damageClaim.status);
      setAdminNotes(order.damageClaim.adminNotes || '');
    }
  }, [order.damageClaim]);

  // Handle Photo Upload (up to 5 photos)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      showToast('Maximum 5 photos allowed');
      return;
    }

    const filesToProcess: File[] = Array.from(files).slice(0, remainingSlots) as File[];
    filesToProcess.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleAddSamplePhoto = (sampleUrl: string) => {
    if (photos.length >= 5) {
      showToast('Maximum 5 photos reached');
      return;
    }
    setPhotos((prev) => [...prev, sampleUrl]);
    showToast('Added sample damage proof photo');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Video Upload (Optional)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('Video size exceeds 25MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setVideoData({
          url: event.target.result as string,
          name: file.name,
        });
        showToast('Short proof video attached');
      }
    };
    reader.readAsDataURL(file);

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = () => {
    setVideoData(null);
  };

  // Submit Claim (Customer UI)
  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();

    // Check 1-hour constraint strictly
    if (windowInfo.isExpired) {
      showToast('Damage claims must be reported within 1 hour of delivery.');
      return;
    }

    if (photos.length === 0) {
      showToast('Please upload at least 1 clear photo of product & packaging.');
      return;
    }

    if (!description.trim()) {
      showToast('Please provide a brief description of the issue.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newClaim: DamageClaim = {
        id: `CLM-${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: order.id,
        createdAt: Date.now(),
        reason: selectedReason,
        description: description.trim(),
        photos: [...photos],
        video: videoData?.url,
        videoName: videoData?.name,
        preferredResolution: 'Replacement preferred',
        status: 'Under Review', // Automatically goes into "Under Review" status
        adminNotes: 'Claim received. Awaiting photo/packaging verification.',
      };

      const updatedOrder: Order = {
        ...order,
        damageClaim: newClaim,
      };

      onUpdateOrder(updatedOrder);
      setIsSubmitting(false);
      showToast('Your claim has been submitted and is under review.');
    }, 600);
  };

  // Admin Status Update
  const handleSaveAdminReview = () => {
    if (!order.damageClaim) return;

    const updatedClaim: DamageClaim = {
      ...order.damageClaim,
      status: adminStatus,
      adminNotes: adminNotes.trim(),
      updatedAt: Date.now(),
      reviewedAt: Date.now(),
    };

    const updatedOrder: Order = {
      ...order,
      damageClaim: updatedClaim,
    };

    onUpdateOrder(updatedOrder);
    showToast(`Claim status updated to "${adminStatus}"`);
  };

  // Helper for demo delivery time simulation
  const handleSimulateDeliveryTime = (minsAgo: number) => {
    const simulatedDelivery = Date.now() - minsAgo * 60 * 1000;
    const dateObj = new Date(simulatedDelivery);
    const updatedOrder: Order = {
      ...order,
      deliveredAt: simulatedDelivery,
      deliveredDateFormatted: `${dateObj.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      })} at ${dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    };
    onUpdateOrder(updatedOrder);
    showToast(`Order delivery time adjusted to ${minsAgo} minutes ago`);
  };

  if (!isOpen) return null;

  const existingClaim = order.damageClaim;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#001f3f] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#FF8C00]" />
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  {existingClaim ? 'Damage Claim Status' : 'Report Damaged / Broken Item'}
                </h3>
                <p className="text-[11px] text-gray-300">
                  Order #{order.id} • {order.items[0]?.name || 'Item'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Admin toggle */}
              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-colors cursor-pointer flex items-center gap-1 ${
                  isAdminMode
                    ? 'bg-[#FF8C00] text-white border-[#FF8C00]'
                    : 'bg-white/10 text-gray-200 border-white/20 hover:bg-white/20'
                }`}
                title="Toggle Admin Claims Desk"
              >
                <Lock className="w-3 h-3" />
                <span>{isAdminMode ? 'Admin Desk' : 'Admin'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Delivery Time & Live Window Banner */}
            <div
              className={`p-3 rounded-2xl border ${
                windowInfo.isExpired
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-amber-950'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Clock
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      windowInfo.isExpired ? 'text-rose-600' : 'text-[#FF8C00]'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs">
                        Delivered: {windowInfo.formattedDeliveryTime}
                      </span>
                    </div>

                    {/* Live real countdown timer display */}
                    {!windowInfo.isExpired ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-[#001f3f] text-xs">
                          Damage claim window: {windowInfo.minutes} minute
                          {windowInfo.minutes === 1 ? '' : 's'}{' '}
                          <span className="text-[#FF8C00] font-mono">
                            {windowInfo.seconds.toString().padStart(2, '0')}s
                          </span>{' '}
                          remaining
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 font-bold text-rose-700 text-xs">
                        Damage claims must be reported within 1 hour of delivery.
                      </p>
                    )}
                  </div>
                </div>

                {/* 1-Hour Rule Pill */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    windowInfo.isExpired
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-white/80 text-orange-800 border-orange-200'
                  }`}
                >
                  {windowInfo.isExpired ? 'Window Expired' : '1-Hour Rule'}
                </span>
              </div>

              {/* Notice under timer */}
              <p className="text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-200/60 leading-relaxed">
                {windowInfo.isExpired
                  ? 'The 60-minute post-delivery claim window has elapsed. Transit damages must be reported promptly upon delivery with packaging proof.'
                  : 'Report physical defects, cracks, or wrong items with photo/packaging proof before the 1-hour window expires.'}
              </p>

              {/* Demo Simulation Helper for Easy Testing */}
              <div className="mt-2.5 pt-2 border-t border-dashed border-gray-300/80 flex items-center justify-between text-[10px]">
                <span className="text-gray-500 font-medium">Test Time Window:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSimulateDeliveryTime(18)}
                    className="px-1.5 py-0.5 bg-white border border-gray-200 hover:border-[#FF8C00] rounded text-[9px] font-bold text-gray-700 cursor-pointer"
                    title="Simulate 18 mins ago (42m left)"
                  >
                    18m ago (~42m left)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateDeliveryTime(55)}
                    className="px-1.5 py-0.5 bg-white border border-gray-200 hover:border-[#FF8C00] rounded text-[9px] font-bold text-gray-700 cursor-pointer"
                    title="Simulate 55 mins ago (5m left)"
                  >
                    55m ago (~5m left)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateDeliveryTime(120)}
                    className="px-1.5 py-0.5 bg-white border border-rose-200 hover:bg-rose-100 rounded text-[9px] font-bold text-rose-700 cursor-pointer"
                    title="Simulate 2 hours ago (Expired)"
                  >
                    2h ago (Expired)
                  </button>
                </div>
              </div>
            </div>

            {/* ADMIN VERIFICATION DESK (If toggled or active) */}
            {isAdminMode && existingClaim && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#FF8C00]" />
                    <span className="font-bold text-xs text-amber-400">
                      Claims Admin Verification Desk
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Claim ID: {existingClaim.id}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300">
                    Update Claim Status:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CLAIM_STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setAdminStatus(st)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all border cursor-pointer ${
                          adminStatus === st
                            ? 'bg-[#FF8C00] text-white border-[#FF8C00] shadow-sm'
                            : 'bg-slate-800/80 text-gray-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Policy reminder for admin */}
                  <div className="p-2 bg-slate-800/80 rounded-lg text-[10px] text-gray-300 border border-slate-700 space-y-1">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Default Resolution: REPLACEMENT</span>
                    </div>
                    <p className="text-gray-400 leading-tight">
                      Do not automatically approve refunds. Refunds must only be approved if the replacement accessory is out of stock.
                    </p>
                  </div>

                  {/* Admin Notes */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-300 font-bold">
                      Admin Audit Notes / Resolution Memo:
                    </label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Photo evidence verified intact seal broken in transit. Replacement dispatch scheduled."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8C00]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveAdminReview}
                    className="w-full py-2 bg-[#FF8C00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Save &amp; Update Claim
                  </button>
                </div>
              </div>
            )}

            {/* IF CLAIM ALREADY EXISTS: DISPLAY STATUS & EVIDENCE */}
            {existingClaim ? (
              <div className="space-y-3.5">
                {/* Status Badge Card */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        Claim Reference
                      </span>
                      <span className="text-xs font-black text-[#001f3f]">
                        {existingClaim.id}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full border ${
                        existingClaim.status === 'Approved – Replacement'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : existingClaim.status === 'Approved – Refund'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : existingClaim.status === 'Under Review'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : existingClaim.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : existingClaim.status === 'Completed'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {existingClaim.status}
                    </span>
                  </div>

                  {/* Confirmation Message */}
                  {existingClaim.status === 'Under Review' && (
                    <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
                      <span className="font-bold">
                        Your claim has been submitted and is under review.
                      </span>
                    </div>
                  )}

                  {/* Resolution banner */}
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Selected Resolution:</span>
                    <span className="font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      {existingClaim.preferredResolution}
                    </span>
                  </div>

                  {/* Claim Details */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Reason Reported:</span>
                      <span className="font-bold text-[#001f3f]">
                        {existingClaim.reason}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Submitted At:</span>
                      <span className="font-bold text-gray-700">
                        {new Date(existingClaim.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {existingClaim.adminNotes && (
                      <div className="p-2 bg-gray-50 rounded-lg text-[11px] text-gray-600 border border-gray-100 mt-2">
                        <span className="font-bold text-[#001f3f] block mb-0.5">
                          Claims Desk Note:
                        </span>
                        {existingClaim.adminNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Evidence Gallery */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#001f3f]">
                      Uploaded Photo Evidence ({existingClaim.photos.length}/5)
                    </h4>
                    <span className="text-[10px] text-gray-400">Tap to enlarge</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {existingClaim.photos.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(img)}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group hover:border-[#FF8C00] transition-colors"
                      >
                        <img
                          src={img}
                          alt={`Proof ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Video Evidence if attached */}
                  {existingClaim.video && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      <span className="font-bold text-xs text-[#001f3f] block">
                        Uploaded Video Proof
                      </span>
                      <video
                        src={existingClaim.video}
                        controls
                        className="w-full rounded-xl max-h-48 bg-black"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* IF NO CLAIM YET: REPORT FORM */
              <form onSubmit={handleSubmitClaim} className="space-y-4">
                {/* Step 1: Select Issue Reason */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2.5">
                  <label className="font-bold text-xs text-[#001f3f] block">
                    1. Select Issue Reason <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {CLAIM_REASONS.map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          selectedReason === reason
                            ? 'border-[#FF8C00] bg-orange-50/50 text-[#001f3f] font-bold'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="text-xs">{reason}</span>
                        <input
                          type="radio"
                          name="claimReason"
                          value={reason}
                          checked={selectedReason === reason}
                          onChange={() => setSelectedReason(reason)}
                          className="w-4 h-4 text-[#FF8C00] focus:ring-[#FF8C00]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Resolution Preference Banner: Replacement Preferred */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-emerald-900">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#001f3f] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Resolution Policy
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Replacement preferred
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Under QukeBasket’s certified guarantee, damage claims default to a brand-new doorstep replacement dispatched immediately upon review. Refunds are processed only when replacement inventory is unavailable.
                  </p>
                </div>

                {/* Step 2: Description */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                  <label className="font-bold text-xs text-[#001f3f] block">
                    2. Describe Damage or Issue <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how the item is damaged (e.g. cable cracked near joint upon unboxing, screen protector arrived broken inside bubble pouch)..."
                    className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f]"
                  />
                </div>

                {/* Step 3: Photo Evidence Upload (Up to 5 Photos) */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-xs text-[#001f3f] block">
                        3. Upload Photo Evidence <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-gray-500">
                        Upload clear photos of product and packaging ({photos.length}/5)
                      </span>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {photos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-[#001f3f] hover:bg-[#FF8C00] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Add Photos</span>
                      </button>
                    )}
                  </div>

                  {/* Photo Thumbnails */}
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
                        >
                          <img
                            src={photo}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow cursor-pointer hover:bg-rose-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {photos.length < 5 && (
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#FF8C00] flex flex-col items-center justify-center text-gray-400 hover:text-[#FF8C00] cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mb-1" />
                          <span className="text-[10px] font-semibold">+ Add</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => photoInputRef.current?.click()}
                      className="p-4 border-2 border-dashed border-gray-200 hover:border-[#FF8C00] rounded-xl text-center cursor-pointer transition-colors bg-gray-50/50"
                    >
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="font-bold text-xs text-[#001f3f]">
                        Tap to select or take photo proof
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        PNG, JPG, WEBP accepted (up to 5 photos)
                      </p>
                    </div>
                  )}

                  {/* Quick Preset Sample Photos for Fast Evaluation */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-500 font-medium block mb-1.5">
                      Or attach pre-verified test evidence:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_EVIDENCE_PHOTOS.map((sample, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={photos.length >= 5}
                          onClick={() => handleAddSamplePhoto(sample.url)}
                          className="px-2 py-1 bg-gray-100 hover:bg-orange-50 hover:text-[#FF8C00] border border-gray-200 rounded-md text-[10px] font-medium text-gray-700 cursor-pointer disabled:opacity-50"
                        >
                          + {sample.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 4: Optional Short Video Upload */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-xs text-[#001f3f] block">
                        4. Upload Short Video Proof (Optional)
                      </label>
                      <span className="text-[10px] text-gray-400">
                        Shows defect in action (MP4, MOV, max 25MB)
                      </span>
                    </div>

                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />

                    {!videoData && (
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-[#FF8C00]" />
                        <span>Attach Video</span>
                      </button>
                    )}
                  </div>

                  {videoData && (
                    <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#001f3f] truncate">
                          🎬 {videoData.name}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <video
                        src={videoData.url}
                        controls
                        className="w-full rounded-lg max-h-36 bg-black"
                      />
                    </div>
                  )}
                </div>

                {/* Submission Action */}
                <div className="pt-1 space-y-2">
                  {windowInfo.isExpired ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-1">
                      <p className="font-extrabold text-rose-800 text-xs">
                        Damage claims must be reported within 1 hour of delivery.
                      </p>
                      <p className="text-[10px] text-rose-600">
                        Submission has been disabled because the 1-hour window for Order #{order.id} has expired.
                      </p>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={
                      windowInfo.isExpired ||
                      photos.length === 0 ||
                      !description.trim() ||
                      isSubmitting
                    }
                    className={`w-full py-3 text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                      windowInfo.isExpired || photos.length === 0 || !description.trim()
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
                        : 'bg-[#FF8C00] hover:bg-orange-600 active:bg-orange-700 cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Claim...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4" />
                        <span>Submit Damage Claim</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    Once submitted, your claim enters &ldquo;Under Review&rdquo; by our Bangalore dispatch desk.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Full Image Lightbox */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-lg max-h-[85vh]">
              <img
                src={lightboxImage}
                alt="Damage Proof Enlarge"
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
