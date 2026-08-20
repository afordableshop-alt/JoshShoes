import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Truck, CheckCircle2, Clock, Search, ChevronDown, ChevronUp, RotateCcw, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { useStore, Order } from '../context/StoreContext';

export default function OrderHistoryModal() {
  const { isOrdersOpen, setIsOrdersOpen, orders, addToCart, setIsCheckoutOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  if (!isOrdersOpen) return null;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatusFilter === 'All' || order.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    setCopiedTracking(trackingNum);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => addToCart(item));
    setIsOrdersOpen(false);
    setIsCheckoutOpen(true);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Processing</span>;
      case 'In Transit':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> In Transit</span>;
      case 'Out for Delivery':
        return <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
    }
  };

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return 1;
      case 'In Transit': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Order History and Status Modal"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto"
        onClick={() => setIsOrdersOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col my-auto max-h-[92vh] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 shrink-0">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-orange-500" />
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase">
                  Order History & Status
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Track deliveries, past shoe purchases & receipts
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOrdersOpen(false)}
              aria-label="Close order history modal"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search orders or products..."
                aria-label="Search order history or purchased footwear"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter orders by status">
              {['All', 'Processing', 'In Transit', 'Delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  aria-label={`Filter orders by ${status} status`}
                  aria-pressed={selectedStatusFilter === status}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                    selectedStatusFilter === status
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Body List */}
          <div className="p-6 overflow-y-auto space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-zinc-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-bold text-base text-zinc-600 dark:text-zinc-300">No matching orders found</p>
                <p className="text-xs text-zinc-500 mt-1">Try searching for a different term or filter.</p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                const currentStep = getStepIndex(order.status);

                return (
                  <div 
                    key={order.id} 
                    className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-800/40 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  >
                    {/* Order Header Card */}
                    <div 
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/60 hover:bg-zinc-100/60 dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-sm shrink-0">
                          JOSH
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-base text-zinc-900 dark:text-white">{order.id}</span>
                            <span className="text-xs text-zinc-400">• {order.date}</span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Total: <strong className="text-zinc-900 dark:text-white">${order.total.toFixed(2)}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-end md:self-auto">
                        {getStatusBadge(order.status)}
                        <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Order Content Details (Expanded) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-zinc-100 dark:border-zinc-800 p-5 md:p-6 space-y-6"
                        >
                          {/* Visual Delivery Stepper */}
                          <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live Delivery Tracker</span>
                              <span className="text-xs font-bold text-orange-500">Est. Arrival: {order.estimatedDelivery}</span>
                            </div>

                            <div className="relative flex justify-between items-center max-w-md mx-auto py-2">
                              {/* Connector Line */}
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-700 -translate-y-1/2 z-0" />
                              <div 
                                className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                              />

                              {[
                                { step: 1, label: 'Placed' },
                                { step: 2, label: 'Processing' },
                                { step: 3, label: 'In Transit' },
                                { step: 4, label: 'Delivered' }
                              ].map(s => (
                                <div key={s.step} className="relative z-10 flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    s.step <= currentStep
                                      ? 'bg-orange-500 text-white shadow-md'
                                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                                  }`}>
                                    {s.step < currentStep ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                                  </div>
                                  <span className={`text-[10px] font-bold mt-1.5 uppercase ${s.step <= currentStep ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                                    {s.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Purchased Items Grid */}
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Items Purchased</h5>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                  <div className="flex items-center space-x-3">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl bg-white dark:bg-zinc-700" />
                                    <div>
                                      <h6 className="font-bold text-sm text-zinc-900 dark:text-white">{item.name}</h6>
                                      <p className="text-xs text-zinc-500">
                                        Qty: {item.quantity} {item.size ? `• Size US ${item.size}` : ''} {item.color ? `• ${item.color}` : ''}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-bold text-sm text-zinc-900 dark:text-white">${(item.numericPrice * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Details & Payment Breakdown Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800 text-xs space-y-2">
                              <span className="font-bold uppercase tracking-wider text-zinc-400 block mb-1">Shipping Destination</span>
                              <p className="font-bold text-zinc-900 dark:text-white">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                              </p>
                              <p className="text-zinc-500">{order.shippingAddress.address}</p>
                              <p className="text-zinc-500">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                              
                              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                                <span className="text-zinc-500">Tracking Code:</span>
                                <button 
                                  onClick={() => handleCopyTracking(order.trackingNumber)}
                                  className="font-mono font-bold text-orange-500 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  {order.trackingNumber}
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                              {copiedTracking === order.trackingNumber && (
                                <p className="text-[10px] text-emerald-500 font-bold text-right">Copied to clipboard!</p>
                              )}
                            </div>

                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800 text-xs space-y-2">
                              <span className="font-bold uppercase tracking-wider text-zinc-400 block mb-1">Payment Summary</span>
                              <div className="flex justify-between text-zinc-500">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-emerald-500">
                                  <span>Discount</span>
                                  <span>-${order.discount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-zinc-500">
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                              </div>
                              <div className="flex justify-between text-zinc-500">
                                <span>Sales Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-white pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
                                <span>Total Paid ({order.paymentMethod})</span>
                                <span className="text-orange-500">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-2">
                            <button
                              onClick={() => handleReorder(order)}
                              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Reorder All Items
                            </button>
                            <button
                              onClick={() => handleCopyTracking(order.trackingNumber)}
                              className="border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Track Shipment
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
