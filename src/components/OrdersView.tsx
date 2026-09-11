import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Truck,
  Package,
  Clock,
  MapPin,
  X,
  PhoneCall,
  ShoppingBag,
  ShieldAlert,
  AlertTriangle,
  Camera,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Order, DamageClaim, ClaimStatus } from '../types';
import { DamageClaimModal } from './DamageClaimModal';
import { getClaimWindowInfo } from '../utils/claimUtils';

interface OrdersViewProps {
  orders: Order[];
  onBackToShopping: () => void;
  showToast: (msg: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onBackToShopping,
  showToast,
  onUpdateOrder,
}) => {
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [selectedClaimOrder, setSelectedClaimOrder] = useState<Order | null>(null);
  const [isClaimModalAdminMode, setIsClaimModalAdminMode] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'delivered' | 'claims'>('all');

  // Real-time ticking counter so all countdown timers on order cards tick every second
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenClaimModal = (order: Order, adminMode: boolean = false) => {
    setSelectedClaimOrder(order);
    setIsClaimModalAdminMode(adminMode);
  };

  const handleSimulateDelivery = (order: Order) => {
    const deliveryTimestamp = Date.now() - 18 * 60 * 1000; // 18 mins ago (42m window left)
    const dateObj = new Date(deliveryTimestamp);
    const updated: Order = {
      ...order,
      status: 'Delivered',
      deliveredAt: deliveryTimestamp,
      deliveredDateFormatted: `Today at ${dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    };
    onUpdateOrder(updated);
    showToast(`Order #${order.id} marked Delivered! 1-Hour claim window active (42m remaining).`);
  };

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'delivered') return order.status === 'Delivered';
    if (activeFilter === 'claims') return !!order.damageClaim;
    return true;
  });

  const claimsCount = orders.filter((o) => !!o.damageClaim).length;
  const underReviewCount = orders.filter(
    (o) => o.damageClaim && (o.damageClaim.status === 'Under Review' || o.damageClaim.status === 'Pending Review')
  ).length;

  return (
    <div className="p-4 space-y-4">
      {/* Orders Subheader: Order count & Shop More action */}
      <div className="flex items-center justify-between pt-0.5">
        <p className="text-xs font-semibold text-gray-500">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
        </p>

        <button
          type="button"
          onClick={onBackToShopping}
          className="text-xs font-bold text-[#FF8C00] hover:underline cursor-pointer"
        >
          + Shop More
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-white text-[#001f3f] shadow-sm font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          All ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('delivered')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
            activeFilter === 'delivered'
              ? 'bg-white text-[#001f3f] shadow-sm font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Delivered ({orders.filter((o) => o.status === 'Delivered').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('claims')}
          className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer relative ${
            activeFilter === 'claims'
              ? 'bg-white text-[#001f3f] shadow-sm font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Claims ({claimsCount})
          {underReviewCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#FF8C00] text-white text-[9px] font-black rounded-full">
              {underReviewCount}
            </span>
          )}
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 text-[#FF8C00] flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-[#001f3f]">
            {activeFilter === 'claims' ? 'No damage claims yet' : 'No orders found'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            {activeFilter === 'claims'
              ? 'Any damage or defective claims filed within 1 hour of delivery will appear here.'
              : 'Explore genuine mobile accessories with 100% authentic brand warranty!'}
          </p>
          <button
            type="button"
            onClick={onBackToShopping}
            className="px-5 py-2.5 bg-[#FF8C00] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm uppercase tracking-wider"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => {
            const hasDelivered = order.status === 'Delivered';
            const windowInfo = getClaimWindowInfo(order.deliveredAt, now);
            const claim = order.damageClaim;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3"
              >
                {/* Top Order Meta */}
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-extrabold text-[#001f3f]">
                      Order #{order.id}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {order.deliveredDateFormatted
                        ? `Delivered: ${order.deliveredDateFormatted}`
                        : order.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : 'text-[#FF8C00] bg-orange-50 border border-orange-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#001f3f] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-gray-400">
                          Qty: {item.quantity} •{' '}
                          <span className="font-bold text-[#FF8C00]">
                            ₹{item.price * item.quantity}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address & Total */}
                <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-600 flex items-start justify-between gap-2 border border-gray-100">
                  <div className="flex items-start gap-1.5 text-[11px] leading-snug">
                    <MapPin className="w-3.5 h-3.5 text-[#FF8C00] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#001f3f]">
                        {order.deliveryAddress?.fullName || 'Delivery Address'}
                      </span>
                      <p className="text-gray-500">
                        {order.deliveryAddress?.city || ''} {order.deliveryAddress?.pincode ? `- ${order.deliveryAddress.pincode}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-400 block">
                      {order.paymentMethod}
                    </span>
                    <span className="text-xs font-black text-[#001f3f]">
                      Total: ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* --- REAL DAMAGE CLAIM SECTION --- */}
                {hasDelivered && (
                  <div className="pt-0.5">
                    {claim ? (
                      /* ACTIVE CLAIM CARD */
                      <div className="bg-gradient-to-r from-orange-50/70 to-amber-50/70 rounded-xl p-3 border border-orange-200/90 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-[#FF8C00]" />
                            <span className="text-xs font-black text-[#001f3f]">
                              Damage Claim #{claim.id}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                              claim.status === 'Approved – Replacement'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : claim.status === 'Approved – Refund'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : claim.status === 'Under Review'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : claim.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : claim.status === 'Completed'
                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {claim.status === 'Under Review' && (
                              <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                            )}
                            {claim.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/70 p-2 rounded-lg border border-orange-100">
                          <div>
                            <span className="text-gray-400 block text-[10px]">Reason</span>
                            <span className="font-bold text-[#001f3f]">
                              {claim.reason}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">Resolution</span>
                            <span className="font-bold text-emerald-700">
                              {claim.preferredResolution}
                            </span>
                          </div>
                        </div>

                        {/* Evidence preview count */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-[#FF8C00]" />
                            {claim.photos.length} photo{claim.photos.length === 1 ? '' : 's'} proof
                            {claim.video && ' • 🎬 Video attached'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(claim.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleOpenClaimModal(order, false)}
                            className="flex-1 py-1.5 bg-white border border-gray-200 hover:border-[#FF8C00] text-[#001f3f] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            View Claim Details &amp; Proof
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenClaimModal(order, true)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Open claims admin review desk"
                          >
                            <Lock className="w-3 h-3 text-[#FF8C00]" />
                            <span>Admin Desk</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* NO CLAIM YET: SHOW LIVE 1-HOUR COUNTDOWN TIMER & REPORT BUTTON */
                      <div
                        className={`rounded-xl p-3 border space-y-2 ${
                          windowInfo.isExpired
                            ? 'bg-gray-50 border-gray-200 text-gray-600'
                            : 'bg-orange-50/70 border-orange-200 text-amber-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {!windowInfo.isExpired ? (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="font-extrabold text-xs text-[#001f3f]">
                                Damage claim window: {windowInfo.minutes} minute
                                {windowInfo.minutes === 1 ? '' : 's'}{' '}
                                <span className="text-[#FF8C00] font-mono">
                                  {windowInfo.seconds.toString().padStart(2, '0')}s
                                </span>{' '}
                                remaining
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>Claim window expired (reported within 1 hr only)</span>
                            </div>
                          )}

                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              windowInfo.isExpired
                                ? 'bg-gray-200 text-gray-600 border-gray-300'
                                : 'bg-white text-orange-800 border-orange-200'
                            }`}
                          >
                            {windowInfo.isExpired ? 'Expired' : '1-Hr Window'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <p className="text-[10px] text-gray-500 leading-tight">
                            {windowInfo.isExpired
                              ? 'Transit damage must be reported within 1 hr of delivery.'
                              : 'Broken or damaged accessory? Upload photos within 1 hour for doorstep replacement.'}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleOpenClaimModal(order, false)}
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg shrink-0 transition-colors cursor-pointer border ${
                              windowInfo.isExpired
                                ? 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
                                : 'bg-[#FF8C00] hover:bg-orange-600 text-white border-[#FF8C00] shadow-sm'
                            }`}
                          >
                            Report an Issue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* If order placed but not yet delivered: test shortcut */}
                {!hasDelivered && (
                  <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500 bg-blue-50/50 p-2 rounded-xl border border-blue-100">
                    <span>Testing Damage Claim?</span>
                    <button
                      type="button"
                      onClick={() => handleSimulateDelivery(order)}
                      className="px-2 py-1 bg-white border border-blue-200 hover:border-blue-400 text-blue-700 font-bold rounded-lg cursor-pointer"
                    >
                      Mark Delivered (Start 1-Hr Timer)
                    </button>
                  </div>
                )}

                {/* Actions: Track Package & Support */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setTrackingOrder(order)}
                    className="flex-1 py-2 bg-[#001f3f] hover:bg-[#FF8C00] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Package</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenClaimModal(order, false)}
                    className="px-3 py-2 border border-gray-200 hover:border-[#FF8C00] hover:bg-orange-50/50 text-gray-700 hover:text-[#001f3f] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3 h-3 text-[#FF8C00]" />
                    <span>{claim ? 'View Claim' : 'Report Issue'}</span>
                  </button>

                  <a
                    href="tel:180078532275"
                    onClick={() => showToast('Connecting to Toll-Free Support')}
                    className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3 text-[#FF8C00]" />
                    <span>Help</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-end justify-center">
          <div className="w-full max-w-[390px] bg-white rounded-t-3xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FF8C00]" />
                <h3 className="font-bold text-sm text-[#001f3f]">
                  Track Order #{trackingOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tracking Milestones */}
            <div className="space-y-4 py-2 pl-2">
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <div className="pb-4 border-l-2 border-emerald-500 pl-4 -ml-6 pt-0.5 flex-1">
                  <h4 className="text-xs font-bold text-[#001f3f]">
                    Order Confirmed
                  </h4>
                  <p className="text-[11px] text-gray-500">{trackingOrder.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <div className="pb-4 border-l-2 border-emerald-500 pl-4 -ml-6 pt-0.5 flex-1">
                  <h4 className="text-xs font-bold text-[#001f3f]">
                    Packed &amp; Sealed
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Quality inspection passed at Bengaluru Fulfillment Hub
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <div
                  className={`pb-4 border-l-2 pl-4 -ml-6 pt-0.5 flex-1 ${
                    trackingOrder.status === 'Delivered'
                      ? 'border-emerald-500'
                      : 'border-gray-200'
                  }`}
                >
                  <h4 className="text-xs font-bold text-[#001f3f]">
                    In Transit (Express Logistics)
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    AWB: BLR-EXP-99214 • BlueDart Express
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    trackingOrder.status === 'Delivered'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {trackingOrder.status === 'Delivered' ? '✓' : '○'}
                </div>
                <div className="pl-4 pt-0.5 flex-1">
                  <h4
                    className={`text-xs font-bold ${
                      trackingOrder.status === 'Delivered'
                        ? 'text-emerald-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {trackingOrder.status === 'Delivered' ? 'Delivered' : 'Out for Delivery'}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {trackingOrder.status === 'Delivered'
                      ? trackingOrder.deliveredDateFormatted || 'Doorstep delivered'
                      : `Estimated by ${trackingOrder.estimatedDelivery}`}
                  </p>
                </div>
              </div>
            </div>

            {/* If delivered: show report issue CTA inside tracking modal */}
            {trackingOrder.status === 'Delivered' && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#001f3f]">
                    Item Damage or Issue?
                  </span>
                  <span className="text-[10px] text-[#FF8C00] font-bold">
                    1-Hour Window
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Defective, broken, or damaged items must be reported within 60 minutes with photo evidence.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const ord = trackingOrder;
                    setTrackingOrder(null);
                    handleOpenClaimModal(ord, false);
                  }}
                  className="w-full py-2 bg-[#FF8C00] hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Report Damage / Defect Claim
                </button>
              </div>
            )}

            {/* Delivery address info in tracking */}
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 border border-gray-100">
              <span className="font-bold text-[#001f3f] block mb-0.5">
                Delivery Address:
              </span>
              <p className="text-[11px]">
                {trackingOrder.deliveryAddress.building},{' '}
                {trackingOrder.deliveryAddress.street},{' '}
                {trackingOrder.deliveryAddress.city} -{' '}
                {trackingOrder.deliveryAddress.pincode}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setTrackingOrder(null)}
              className="w-full py-2.5 bg-[#001f3f] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close Tracking
            </button>
          </div>
        </div>
      )}

      {/* Real Damage Claim Modal */}
      {selectedClaimOrder && (
        <DamageClaimModal
          order={selectedClaimOrder}
          isOpen={!!selectedClaimOrder}
          initialAdminMode={isClaimModalAdminMode}
          onClose={() => setSelectedClaimOrder(null)}
          onUpdateOrder={(updated) => {
            onUpdateOrder(updated);
            setSelectedClaimOrder(updated);
          }}
          showToast={showToast}
        />
      )}

    </div>
  );
};
