import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Banknote,
  ShieldCheck,
  Truck,
  Plus,
  ArrowLeft,
  Check,
  ChevronRight,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, SavedAddress, Order } from '../types';
import { calculateDeliveryFee } from '../utils/delivery';
import { lookupPinCode } from '../utils/pincode';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  savedAddresses: SavedAddress[];
  onUpdateAddresses: (addresses: SavedAddress[]) => void;
  isCodSelected: boolean;
  onOrderPlaced: (order: Order) => void;
  showToast: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  savedAddresses,
  onUpdateAddresses,
  isCodSelected: initialCodSelected,
  onOrderPlaced,
  showToast,
}) => {
  // Selected delivery address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = savedAddresses.find((a) => a.isDefault);
    return defaultAddr ? defaultAddr.id : savedAddresses[0]?.id || '';
  });

  // Keep selected address in sync if addresses change
  useEffect(() => {
    if (!savedAddresses.some((a) => a.id === selectedAddressId)) {
      const defaultAddr = savedAddresses.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : savedAddresses[0]?.id || '');
    }
  }, [savedAddresses, selectedAddressId]);

  // Address picker & add-address sub-views
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New address form state
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: '',
    mobile: '',
    building: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [addressFormErrors, setAddressFormErrors] = useState<Record<string, string>>({});

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>(
    initialCodSelected ? 'COD' : 'COD'
  );

  // Order Placement State
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  // Price calculations
  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryInfo = calculateDeliveryFee(selectedAddress, itemsTotal);
  const deliveryFee = deliveryInfo.fee;
  const orderTotal = itemsTotal + deliveryFee;

  const [checkoutPostOffices, setCheckoutPostOffices] = useState<string[]>([]);

  const handleCheckoutPincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setNewAddressForm((prev) => ({ ...prev, pincode: clean }));
    setCheckoutPostOffices([]);
    if (clean.length === 6) {
      const res = await lookupPinCode(clean);
      if (res.success) {
        const poNames = res.postOffices.map((po) => po.name);
        setCheckoutPostOffices(poNames);
        setNewAddressForm((prev) => ({
          ...prev,
          city: res.district,
          state: res.state,
          street: poNames.length > 0 ? poNames[0] : prev.street,
        }));
      }
    }
  };

  const handleValidateNewAddress = () => {
    const errors: Record<string, string> = {};
    if (!newAddressForm.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!newAddressForm.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(newAddressForm.mobile.trim().replace(/\D/g, ''))) {
      errors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!newAddressForm.building.trim()) errors.building = 'Building/Flat is required';
    if (!newAddressForm.street.trim()) errors.street = 'Street/Area is required';
    if (!newAddressForm.city.trim()) errors.city = 'City is required';
    if (!newAddressForm.state.trim()) errors.state = 'State is required';
    if (!newAddressForm.pincode.trim()) {
      errors.pincode = 'PIN Code is required';
    } else if (!/^[1-9][0-9]{5}$/.test(newAddressForm.pincode.trim())) {
      errors.pincode = 'Enter a valid 6-digit PIN code';
    }
    setAddressFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewAddressFromCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidateNewAddress()) {
      showToast('Please fix the errors in address');
      return;
    }

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      fullName: newAddressForm.fullName.trim(),
      mobile: newAddressForm.mobile.trim(),
      building: newAddressForm.building.trim(),
      street: newAddressForm.street.trim(),
      landmark: newAddressForm.landmark.trim(),
      city: newAddressForm.city.trim(),
      state: newAddressForm.state.trim(),
      pincode: newAddressForm.pincode.trim(),
      isDefault: newAddressForm.isDefault || savedAddresses.length === 0,
    };

    let updatedAddresses = [...savedAddresses];
    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      updatedAddresses.unshift(newAddr);
    } else {
      updatedAddresses.unshift(newAddr);
    }

    onUpdateAddresses(updatedAddresses);
    setSelectedAddressId(newAddr.id);
    setIsAddingNewAddress(false);
    setIsChangingAddress(false);
    setNewAddressForm({
      fullName: '',
      mobile: '',
      building: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    showToast('Delivery address saved & selected');
  };

  const handleConfirmOrder = () => {
    if (!selectedAddress) {
      showToast('Please add or select a delivery address');
      setIsChangingAddress(true);
      return;
    }

    setIsPlacing(true);

    setTimeout(() => {
      const orderNumber = `QK-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newOrder: Order = {
        id: orderNumber,
        date: orderDate,
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
        })),
        totalAmount: orderTotal,
        status: 'Order Placed',
        paymentMethod:
          paymentMethod === 'COD' ? 'Cash on Delivery' : 'Doorstep UPI QR',
        deliveryAddress: selectedAddress,
        estimatedDelivery: 'Tomorrow by 8:00 PM',
      };

      setPlacedOrder(newOrder);
      setIsPlacing(false);
      onOrderPlaced(newOrder);
      showToast(`Order #${orderNumber} placed successfully!`);
    }, 800);
  };

  const handleCloseAndReset = () => {
    setPlacedOrder(null);
    setIsChangingAddress(false);
    setIsAddingNewAddress(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={placedOrder ? handleCloseAndReset : onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-w-[390px] mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#001f3f] text-white">
              <div className="flex items-center gap-2">
                {isChangingAddress || isAddingNewAddress ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (isAddingNewAddress) {
                        setIsAddingNewAddress(false);
                      } else {
                        setIsChangingAddress(false);
                      }
                    }}
                    className="p-1 -ml-2 text-gray-300 hover:text-white rounded-full cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <Truck className="w-5 h-5 text-[#FF8C00]" />
                )}
                <h3 className="font-bold text-sm">
                  {placedOrder
                    ? 'Order Confirmed'
                    : isAddingNewAddress
                    ? 'Add Delivery Address'
                    : isChangingAddress
                    ? 'Select Delivery Address'
                    : 'Checkout & Delivery'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-white bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {placedOrder ? (
                /* Success Screen */
                <div className="py-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Payment on Delivery
                    </span>
                    <h2 className="text-base font-black text-[#001f3f] mt-0.5">
                      Order Placed Successfully!
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Order ID: <span className="font-bold text-[#001f3f]">{placedOrder.id}</span>
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#FF8C00] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#001f3f] block">
                          Delivering To: {placedOrder.deliveryAddress?.fullName || 'Customer'}
                        </span>
                        <span className="text-gray-500 text-[11px]">
                          {placedOrder.deliveryAddress?.building || ''},{' '}
                          {placedOrder.deliveryAddress?.street || ''},{' '}
                          {placedOrder.deliveryAddress?.city || ''} -{' '}
                          {placedOrder.deliveryAddress?.pincode || ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Items Subtotal:</span>
                      <span>₹{itemsTotal}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Delivery Fee:</span>
                      <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'text-gray-700 font-semibold'}>
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                      <span className="text-gray-500">Estimated Delivery:</span>
                      <span className="font-bold text-emerald-700">
                        {placedOrder.estimatedDelivery}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-bold">Total Amount Payable:</span>
                      <span className="font-extrabold text-[#001f3f] text-sm">
                        ₹{placedOrder.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCloseAndReset}
                      className="w-full py-3 bg-[#FF8C00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      View in Orders Tab
                    </button>
                  </div>
                </div>
              ) : isAddingNewAddress ? (
                /* Add New Address Form Inside Checkout */
                <form
                  onSubmit={handleSaveNewAddressFromCheckout}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={newAddressForm.fullName}
                      onChange={(e) =>
                        setNewAddressForm({
                          ...newAddressForm,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                    />
                    {addressFormErrors.fullName && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {addressFormErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={newAddressForm.mobile}
                      onChange={(e) =>
                        setNewAddressForm({
                          ...newAddressForm,
                          mobile: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                    />
                    {addressFormErrors.mobile && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {addressFormErrors.mobile}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                        Building / Flat *
                      </label>
                      <input
                        type="text"
                        placeholder="House / Flat"
                        value={newAddressForm.building}
                        onChange={(e) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            building: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                        Street / Area *
                      </label>
                      <input
                        type="text"
                        placeholder="Street / Colony"
                        value={newAddressForm.street}
                        onChange={(e) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            street: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="Nearby landmark (optional)"
                      value={newAddressForm.landmark}
                      onChange={(e) =>
                        setNewAddressForm({
                          ...newAddressForm,
                          landmark: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddressForm.city}
                        onChange={(e) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddressForm.state}
                        onChange={(e) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                        PIN *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digits"
                        value={newAddressForm.pincode}
                        onChange={(e) => handleCheckoutPincodeChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#001f3f]"
                      />
                    </div>
                  </div>

                  {checkoutPostOffices.length > 0 && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                        Select Post Office / Area *
                      </label>
                      <select
                        value={newAddressForm.street}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#001f3f]"
                      >
                        {checkoutPostOffices.map((po) => (
                          <option key={po} value={po}>
                            {po}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {newAddressForm.pincode.length === 6 && (
                    <div className="p-2.5 bg-orange-50/70 border border-orange-200/80 rounded-lg flex items-center justify-between text-[11px]">
                      <span className="text-gray-600 font-medium">Estimated Delivery Rate:</span>
                      <span className="font-bold text-[#001f3f]">
                        {itemsTotal >= 299
                          ? 'FREE DELIVERY (Order ₹299+)'
                          : `₹${calculateDeliveryFee({ ...newAddressForm, id: 'temp' }, itemsTotal).fee} (${calculateDeliveryFee({ ...newAddressForm, id: 'temp' }, itemsTotal).zone})`}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#FF8C00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                    >
                      Save &amp; Deliver Here
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-4 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : isChangingAddress ? (
                /* Select Existing Address or Add New */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-[#001f3f]">
                      Choose from saved addresses
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF8C00] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New</span>
                    </button>
                  </div>

                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setIsChangingAddress(false);
                        showToast(`Delivering to ${addr.fullName}`);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-[#FF8C00] bg-orange-50/50 ring-1 ring-[#FF8C00]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#001f3f]">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                            {addr.building}, {addr.street}
                            {addr.landmark ? `, ${addr.landmark}` : ''}
                            <br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-[11px] font-medium text-gray-500 mt-1">
                            Mobile: +91 {addr.mobile}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                itemsTotal >= 299
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-orange-50 text-orange-700 border border-orange-200'
                              }`}
                            >
                              {itemsTotal >= 299
                                ? 'FREE Delivery'
                                : `Delivery: ₹${calculateDeliveryFee(addr, itemsTotal).fee} (${calculateDeliveryFee(addr, itemsTotal).zone})`}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            selectedAddressId === addr.id
                              ? 'border-[#FF8C00] bg-[#FF8C00] text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedAddressId === addr.id && (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-[#FF8C00] rounded-xl text-xs font-bold text-[#001f3f] hover:text-[#FF8C00] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Another Address</span>
                  </button>
                </div>
              ) : (
                /* Primary Checkout Overview */
                <div className="space-y-3">
                  {/* 1. Delivery Address Card */}
                  <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#001f3f]">
                        <MapPin className="w-4 h-4 text-[#FF8C00]" />
                        <span>Delivery Address</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsChangingAddress(true)}
                        className="text-xs font-bold text-[#FF8C00] hover:underline cursor-pointer"
                      >
                        Change Address
                      </button>
                    </div>

                    {selectedAddress ? (
                      <div className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-700 leading-relaxed">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#001f3f]">
                            {selectedAddress.fullName}
                          </span>
                          <span className="text-[11px] text-gray-500 font-semibold">
                            +91 {selectedAddress.mobile}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1">
                          {selectedAddress.building}, {selectedAddress.street}
                          {selectedAddress.landmark ? `, Near ${selectedAddress.landmark}` : ''}
                          , {selectedAddress.city} - {selectedAddress.pincode}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                        <p className="text-xs text-orange-900 font-bold mb-2">
                          No delivery address selected
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(true)}
                          className="px-3 py-1.5 bg-[#FF8C00] text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          + Add Address
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2. Order Items Snapshot */}
                  <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#001f3f]">
                        Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                      </span>
                      <span className="text-gray-400 text-[11px]">
                        Fast Doorstep Delivery
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="text-gray-400 text-[11px]">
                              {item.quantity}x
                            </span>
                            <span className="truncate text-gray-700 font-medium">
                              {item.product.name}
                            </span>
                          </div>
                          <span className="font-bold text-[#001f3f] shrink-0">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Payment Method: Cash on Delivery / UPI QR */}
                  <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#001f3f]">
                      <Banknote className="w-4 h-4 text-[#FF8C00]" />
                      <span>Payment Method</span>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#FF8C00] bg-orange-50/40 ring-1 ring-[#FF8C00]'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF8C00] flex items-center justify-center shrink-0">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#001f3f] block">
                            Cash on Delivery / Doorstep UPI QR
                          </span>
                          <span className="text-[10px] text-gray-500 block">
                            Pay with cash or scan courier UPI QR upon delivery
                          </span>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-[#FF8C00] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>

                  {/* 4. Price Breakdown */}
                  <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-800">₹{itemsTotal}</span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Delivery</span>
                        {selectedAddress && !deliveryInfo.isFree && (
                          <span className="text-[10px] text-gray-400">
                            ({deliveryInfo.zone} • {deliveryInfo.distanceDescription})
                          </span>
                        )}
                      </div>
                      {deliveryInfo.isFree ? (
                        <span className="text-emerald-600 font-bold">FREE DELIVERY</span>
                      ) : (
                        <span className="font-semibold text-gray-800">₹{deliveryFee}</span>
                      )}
                    </div>

                    {!deliveryInfo.isFree && (
                      <div className="text-[10px] text-orange-700 bg-orange-50 border border-orange-200/60 px-2 py-1 rounded-md text-center font-medium">
                        Add ₹{299 - itemsTotal} more for <span className="font-bold text-[#FF8C00]">FREE Delivery</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200/80 pt-2 flex items-center justify-between font-extrabold text-[#001f3f] text-sm">
                      <span>Total</span>
                      <span className="text-[#FF8C00]">₹{orderTotal}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Place Order Button */}
            {!placedOrder && !isAddingNewAddress && !isChangingAddress && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isPlacing || !selectedAddress}
                  onClick={handleConfirmOrder}
                  className="w-full py-3.5 bg-[#FF8C00] hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPlacing ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Place Order (₹{orderTotal} • COD)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
