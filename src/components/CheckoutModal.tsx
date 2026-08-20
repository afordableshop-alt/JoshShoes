import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Tag, Trash2, Plus, Minus, Truck, Check, PackageCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore, CartItem, Order } from '../context/StoreContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, addOrder, setIsOrdersOpen, checkoutProduct, setCheckoutProduct } = useStore();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Morgan');
  const [email, setEmail] = useState('alex.m@example.com');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [postalCode, setPostalCode] = useState('97477');
  
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority' | 'express'>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal e.g. 0.1 for 10%
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paypal' | 'klarna'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Determine items to checkout: single product or full cart
  const itemsToCheckout: CartItem[] = checkoutProduct 
    ? [checkoutProduct]
    : cart;

  const subtotal = itemsToCheckout.reduce((acc, item) => acc + (item.numericPrice * item.quantity), 0);
  
  // Shipping cost
  let shippingCost = 0;
  if (shippingMethod === 'standard') {
    shippingCost = subtotal >= 150 ? 0 : 12;
  } else if (shippingMethod === 'priority') {
    shippingCost = 22;
  } else if (shippingMethod === 'express') {
    shippingCost = 35;
  }

  const discountAmount = subtotal * appliedDiscount;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((taxableSubtotal * 0.0825).toFixed(2));
  const finalTotal = Number((taxableSubtotal + shippingCost + taxAmount).toFixed(2));

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'JOSH10') {
      setAppliedDiscount(0.10);
      setPromoMessage({ text: '10% discount applied!', success: true });
    } else if (promoCode.trim().toUpperCase() === 'FREESHIP') {
      setShippingMethod('standard');
      setAppliedDiscount(0);
      setPromoMessage({ text: 'Free standard shipping applied!', success: true });
    } else if (promoCode.trim().toUpperCase() === 'WELCOME15') {
      setAppliedDiscount(0.15);
      setPromoMessage({ text: '15% welcome discount applied!', success: true });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try JOSH10', success: false });
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsToCheckout.length === 0) return;

    setIsProcessing(true);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `JOSH-${randomNum}`;
    const trackingNum = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      items: itemsToCheckout,
      subtotal,
      shipping: shippingCost,
      tax: taxAmount,
      discount: discountAmount,
      total: finalTotal,
      status: 'Processing',
      trackingNumber: trackingNum,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      shippingAddress: {
        firstName,
        lastName,
        email,
        address,
        city,
        postalCode
      },
      paymentMethod: paymentMethod === 'card' ? `Credit Card (${cardNumber.slice(-8)})` : paymentMethod === 'applepay' ? 'Apple Pay' : paymentMethod === 'paypal' ? 'PayPal' : 'Klarna (4 Payments)'
    };

    setTimeout(() => {
      setIsProcessing(false);
      setCompletedOrder(newOrder);
      addOrder(newOrder);
      if (!checkoutProduct) {
        clearCart();
      } else {
        setCheckoutProduct(null);
      }
    }, 1800);
  };

  const handleCloseModal = () => {
    setCompletedOrder(null);
    setStep(1);
    setCheckoutProduct(null);
    onClose();
  };

  const handleOpenOrderHistory = () => {
    handleCloseModal();
    setIsOrdersOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Secure Checkout Dialog"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col my-auto max-h-[92vh] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 shrink-0">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <div>
                  <h3 className="text-xl font-black tracking-tight uppercase">
                    {completedOrder ? 'Order Confirmed' : 'Secure Checkout'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {completedOrder ? `Order #${completedOrder.id}` : '256-Bit SSL Encrypted Transaction'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                aria-label="Close checkout modal dialog"
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto">
              {completedOrder ? (
                /* Success View */
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black tracking-tight mb-2 uppercase">Payment Successful!</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    Thank you for your order, <strong className="text-zinc-900 dark:text-white">{completedOrder.shippingAddress.firstName}</strong>. A confirmation email has been dispatched to <strong className="text-zinc-900 dark:text-white">{completedOrder.shippingAddress.email}</strong>.
                  </p>

                  <div className="bg-zinc-50 dark:bg-zinc-800/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-left space-y-3 mb-8">
                    <div className="flex justify-between text-xs pb-2 border-b border-zinc-200 dark:border-zinc-700">
                      <span className="text-zinc-500">Order ID:</span>
                      <span className="font-bold text-orange-500">{completedOrder.id}</span>
                    </div>
                    <div className="flex justify-between text-xs pb-2 border-b border-zinc-200 dark:border-zinc-700">
                      <span className="text-zinc-500">Tracking Number:</span>
                      <span className="font-mono font-medium">{completedOrder.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between text-xs pb-2 border-b border-zinc-200 dark:border-zinc-700">
                      <span className="text-zinc-500">Estimated Delivery:</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{completedOrder.estimatedDelivery}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-zinc-500">Total Charged:</span>
                      <span className="font-black text-sm text-zinc-900 dark:text-white">${completedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleOpenOrderHistory}
                      className="flex-1 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PackageCheck className="w-4 h-4" />
                      View Order History
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 border border-zinc-300 dark:border-zinc-700 font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </motion.div>
              ) : itemsToCheckout.length === 0 ? (
                /* Empty Cart View */
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                  <h4 className="text-lg font-bold mb-2">Your shopping cart is empty</h4>
                  <p className="text-sm text-zinc-500 mb-6">Add items from the store before proceeding to checkout.</p>
                  <button 
                    onClick={handleCloseModal}
                    className="bg-orange-500 text-white font-bold uppercase tracking-widest text-xs px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Browse Shoes
                  </button>
                </div>
              ) : (
                /* Checkout Wizard */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Form Steps */}
                  <div className="lg:col-span-7 flex flex-col space-y-6">
                    {/* Stepper Header */}
                    <div className="flex items-center space-x-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                      <button 
                        onClick={() => setStep(1)} 
                        className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${step === 1 ? 'text-orange-500' : 'text-zinc-400'}`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-orange-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600'}`}>1</span>
                        <span>Shipping & Delivery</span>
                      </button>
                      <ArrowRight className="w-4 h-4 text-zinc-300" />
                      <button 
                        onClick={() => { if (firstName && address) setStep(2); }}
                        className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${step === 2 ? 'text-orange-500' : 'text-zinc-400'}`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-orange-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600'}`}>2</span>
                        <span>Payment Method</span>
                      </button>
                    </div>

                    {step === 1 ? (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <h4 className="font-bold uppercase tracking-wider text-xs text-zinc-500">Shipping Contact</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-400 mb-1">First Name</label>
                            <input 
                              type="text" 
                              value={firstName} 
                              onChange={e => setFirstName(e.target.value)}
                              placeholder="Alex" 
                              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:border-orange-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-400 mb-1">Last Name</label>
                            <input 
                              type="text" 
                              value={lastName} 
                              onChange={e => setLastName(e.target.value)}
                              placeholder="Morgan" 
                              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:border-orange-500" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Email Address</label>
                          <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            placeholder="alex@example.com" 
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:border-orange-500" 
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Street Address</label>
                          <input 
                            type="text" 
                            value={address} 
                            onChange={e => setAddress(e.target.value)}
                            placeholder="742 Evergreen Terrace" 
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:border-orange-500" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-400 mb-1">City</label>
                            <input 
                              type="text" 
                              value={city} 
                              onChange={e => setCity(e.target.value)}
                              placeholder="Springfield" 
                              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:border-orange-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-400 mb-1">Postal Code</label>
                            <input 
                              type="text" 
                              value={postalCode} 
                              onChange={e => setPostalCode(e.target.value)}
                              placeholder="97477" 
                              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:border-orange-500" 
                            />
                          </div>
                        </div>

                        {/* Shipping Speed Selection */}
                        <div className="pt-2">
                          <label className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">Shipping Speed</label>
                          <div className="space-y-2">
                            {[
                              { id: 'standard', name: 'Standard Ground Delivery', time: '3 - 5 Business Days', price: subtotal >= 150 ? 'FREE' : '$12.00' },
                              { id: 'priority', name: 'Priority Air Express', time: '2 Business Days', price: '$22.00' },
                              { id: 'express', name: 'Overnight Air Courier', time: '1 Business Day', price: '$35.00' }
                            ].map(method => (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => setShippingMethod(method.id as any)}
                                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  shippingMethod === method.id
                                    ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-400'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${shippingMethod === method.id ? 'border-orange-500 bg-orange-500' : 'border-zinc-400'}`}>
                                    {shippingMethod === method.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">{method.name}</p>
                                    <p className="text-[10px] text-zinc-500">{method.time}</p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white">{method.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Continue to Payment Method</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <h4 className="font-bold uppercase tracking-wider text-xs text-zinc-500">Select Payment Method</h4>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'card', label: 'Credit Card', icon: CreditCard },
                            { id: 'applepay', label: 'Apple Pay', icon: ShieldCheck },
                            { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                            { id: 'klarna', label: 'Klarna (Pay in 4)', icon: Tag }
                          ].map(pay => (
                            <button
                              key={pay.id}
                              type="button"
                              onClick={() => setPaymentMethod(pay.id as any)}
                              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                                paymentMethod === pay.id
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-300'
                              }`}
                            >
                              <pay.icon className="w-4 h-4" />
                              <span>{pay.label}</span>
                            </button>
                          ))}
                        </div>

                        {paymentMethod === 'card' && (
                          <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                            <div>
                              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Card Number</label>
                              <input 
                                type="text" 
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                placeholder="4242 4242 4242 4242"
                                className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-mono outline-none focus:border-orange-500" 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-zinc-400 mb-1">Expiry Date</label>
                                <input 
                                  type="text" 
                                  value={cardExpiry}
                                  onChange={e => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-mono outline-none focus:border-orange-500" 
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-zinc-400 mb-1">CVC Code</label>
                                <input 
                                  type="text" 
                                  value={cardCvc}
                                  onChange={e => setCardCvc(e.target.value)}
                                  placeholder="123"
                                  className="w-full p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-mono outline-none focus:border-orange-500" 
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'klarna' && (
                          <div className="bg-pink-500/10 text-pink-600 dark:text-pink-300 p-4 rounded-xl text-xs space-y-1">
                            <p className="font-bold">Pay in 4 interest-free installments of ${(finalTotal / 4).toFixed(2)}</p>
                            <p>First payment due today, remaining 3 due every 2 weeks.</p>
                          </div>
                        )}

                        {/* Promo Code Entry */}
                        <div className="pt-2">
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Promo Code</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={promoCode}
                              onChange={e => setPromoCode(e.target.value)}
                              placeholder="e.g. JOSH10"
                              className="flex-1 p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono uppercase outline-none focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={handleApplyPromo}
                              className="px-4 py-2.5 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold text-xs uppercase rounded-xl hover:bg-orange-500 dark:hover:bg-orange-500 transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                          {promoMessage && (
                            <p className={`text-[11px] font-bold mt-1.5 ${promoMessage.success ? 'text-emerald-500' : 'text-red-500'}`}>
                              {promoMessage.text}
                            </p>
                          )}
                        </div>

                        <div className="flex space-x-3 pt-3">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-5 py-3.5 border border-zinc-300 dark:border-zinc-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleProcessPayment}
                            disabled={isProcessing}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                              <span>Processing Payment...</span>
                            ) : (
                              <span>Complete Order (${finalTotal.toFixed(2)})</span>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column: Order Summary & Cart Breakdown */}
                  <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-full">
                    <h4 className="font-bold uppercase tracking-wider text-xs text-zinc-500 mb-4">
                      Order Items ({itemsToCheckout.reduce((acc, i) => acc + i.quantity, 0)})
                    </h4>

                    {/* Cart Items List */}
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 mb-4 divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
                      {itemsToCheckout.map((item, idx) => (
                        <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="pt-3 first:pt-0 flex space-x-3 items-center">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl bg-white dark:bg-zinc-700" />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{item.name}</h5>
                            <p className="text-[10px] text-zinc-500">
                              Size: {item.size || 'STD'} {item.color ? `• ${item.color}` : ''}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {!checkoutProduct && (
                                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-md">
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                    className="p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-1.5 text-[10px] font-bold">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                    className="p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                ${(item.numericPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {!checkoutProduct && (
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id, item.size, item.color)}
                              className="text-zinc-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Calculated Price Summary */}
                    <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Items Subtotal</span>
                        <span className="font-bold text-zinc-900 dark:text-white">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-500">
                          <span>Promo Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                          <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Shipping & Handling</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Estimated Tax (8.25%)</span>
                        <span className="font-bold text-zinc-900 dark:text-white">${taxAmount.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-700">
                        <span>Total Due</span>
                        <span className="text-orange-500">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
