import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, HelpCircle, PackageCheck, RotateCcw, Ruler, Mail, 
  ShieldCheck, FileText, Sparkles, CheckCircle2, Send, 
  Search, Truck, Clock, ShieldAlert, ArrowRight, Phone
} from 'lucide-react';

export type DocType = 
  | 'help-center' 
  | 'track-order' 
  | 'returns' 
  | 'size-guide' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'care'
  | null;

interface FooterDocModalProps {
  activeDoc: DocType;
  onClose: () => void;
  onOpenDoc: (doc: DocType) => void;
}

export default function FooterDocModal({ activeDoc, onClose, onOpenDoc }: FooterDocModalProps) {
  // Track order state
  const [orderId, setOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [isSearchingOrder, setIsSearchingOrder] = useState(false);

  // Contact form state
  const [contactCategory, setContactCategory] = useState('general');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Returns state
  const [returnOrderId, setReturnOrderId] = useState('');
  const [returnReason, setReturnReason] = useState('Defective item');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setIsSearchingOrder(true);
    setTimeout(() => {
      setIsSearchingOrder(false);
      setTrackedOrder({
        id: orderId.toUpperCase(),
        status: 'In Transit',
        carrier: 'FedEx Express',
        trackingNum: 'FX-982314092-US',
        estimatedDelivery: 'Tomorrow by 7:00 PM',
        steps: [
          { title: 'Order Confirmed', date: 'Jul 27, 2026', done: true },
          { title: 'Quality Check & Packed', date: 'Jul 28, 2026', done: true },
          { title: 'Handed to Carrier (FedEx)', date: 'Jul 28, 2026', done: true },
          { title: 'Out for Delivery', date: 'Jul 29, 2026', done: false },
        ]
      });
    }, 600);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    setContactSent(true);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId.trim()) return;
    setReturnSubmitted(true);
  };

  if (!activeDoc) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                {activeDoc === 'help-center' && <HelpCircle className="w-5 h-5" />}
                {activeDoc === 'track-order' && <PackageCheck className="w-5 h-5" />}
                {activeDoc === 'returns' && <RotateCcw className="w-5 h-5" />}
                {activeDoc === 'size-guide' && <Ruler className="w-5 h-5" />}
                {activeDoc === 'contact' && <Mail className="w-5 h-5" />}
                {activeDoc === 'privacy' && <ShieldCheck className="w-5 h-5" />}
                {activeDoc === 'terms' && <FileText className="w-5 h-5" />}
                {activeDoc === 'care' && <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase dark:text-white">
                  {activeDoc === 'help-center' && 'Help Center & FAQs'}
                  {activeDoc === 'track-order' && 'Order Tracker'}
                  {activeDoc === 'returns' && 'Returns & Exchanges'}
                  {activeDoc === 'size-guide' && 'Official Size Guide'}
                  {activeDoc === 'contact' && 'Contact Support'}
                  {activeDoc === 'privacy' && 'Privacy Policy'}
                  {activeDoc === 'terms' && 'Terms of Service'}
                  {activeDoc === 'care' && 'Footwear Care & Maintenance'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  JoshShoes Documentation & Customer Care
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Nav Tabs */}
          <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex space-x-2 overflow-x-auto text-xs scrollbar-none">
            {[
              { id: 'help-center', label: 'Help & FAQ' },
              { id: 'track-order', label: 'Track Order' },
              { id: 'returns', label: 'Returns' },
              { id: 'size-guide', label: 'Size Guide' },
              { id: 'contact', label: 'Contact Us' },
              { id: 'privacy', label: 'Privacy' },
              { id: 'terms', label: 'Terms' },
              { id: 'care', label: 'Shoe Care' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setContactSent(false);
                  setReturnSubmitted(false);
                  onOpenDoc(tab.id as DocType);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                  activeDoc === tab.id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6">
            {/* 1. HELP CENTER */}
            {activeDoc === 'help-center' && (
              <div className="space-y-6">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center space-x-3 text-sm text-orange-600 dark:text-orange-400">
                  <HelpCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium">
                    Need immediate support? Our support squad is live 24/7 to answer shipping, sizing, or order inquiries.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Frequently Asked Questions</h4>
                  
                  {[
                    {
                      q: 'How long does shipping take?',
                      a: 'Standard domestic shipping takes 2-4 business days. International express shipping takes 3-7 business days depending on destination customs clearance.'
                    },
                    {
                      q: 'What is your return policy?',
                      a: 'We offer hassle-free returns within 30 days of delivery. Sneakers must be unworn, in original condition with tags and original shoebox attached.'
                    },
                    {
                      q: 'Are JoshShoes sneakers authentic and covered by warranty?',
                      a: '100% authentic engineered design. All pairs come with a 1-year structural craftsmanship warranty covering outsole separation and stitch integrity.'
                    },
                    {
                      q: 'Can I cancel or modify an order after placing it?',
                      a: 'Orders process rapidly. You can modify your shipping address within 1 hour of placement through the Order Tracker or by contacting support.'
                    },
                  ].map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                      <h5 className="font-bold text-sm mb-1 dark:text-white flex items-center space-x-2">
                        <span className="text-orange-500">Q.</span>
                        <span>{faq.q}</span>
                      </h5>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-5">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500">Can't find what you're looking for?</span>
                  <button
                    onClick={() => onOpenDoc('contact')}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
                  >
                    Contact Support Team
                  </button>
                </div>
              </div>
            )}

            {/* 2. TRACK ORDER */}
            {activeDoc === 'track-order' && (
              <div className="space-y-6">
                <form onSubmit={handleTrackSubmit} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Enter Order # (e.g. AUR-9482)"
                      value={orderId}
                      onChange={e => setOrderId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 dark:text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearchingOrder}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isSearchingOrder ? 'Searching...' : 'Track'}
                  </button>
                </form>

                {trackedOrder ? (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                      <div>
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Order Status</span>
                        <h4 className="text-lg font-black dark:text-white">{trackedOrder.id} - {trackedOrder.status}</h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-zinc-500">Carrier: {trackedOrder.carrier}</p>
                        <p className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">{trackedOrder.trackingNum}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Delivery Pipeline</p>
                      <div className="space-y-3">
                        {trackedOrder.steps.map((step: any, i: number) => (
                          <div key={i} className="flex items-center space-x-3 text-sm">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.done ? 'bg-emerald-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'
                            }`}>
                              {step.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </div>
                            <div className="flex-1 flex justify-between">
                              <span className={`font-semibold ${step.done ? 'dark:text-white' : 'text-zinc-400'}`}>{step.title}</span>
                              <span className="text-xs text-zinc-400">{step.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-zinc-500 flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-orange-500" />
                      <span>Estimated Arrival: <strong className="text-zinc-800 dark:text-zinc-200">{trackedOrder.estimatedDelivery}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <PackageCheck className="w-10 h-10 mx-auto mb-2 opacity-50 text-orange-500" />
                    <p className="text-sm font-medium">Enter your order ID above to trace real-time fulfillment status.</p>
                    <p className="text-xs mt-1 text-zinc-500">Try sample order: <button onClick={() => setOrderId('JOSH-8821')} className="text-orange-500 underline">JOSH-8821</button></p>
                  </div>
                )}
              </div>
            )}

            {/* 3. RETURNS & EXCHANGES */}
            {activeDoc === 'returns' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: '30-Day Window', desc: 'Return any unworn pair within 30 days of delivery for full refund.', icon: Clock },
                    { title: 'Free Exchanges', desc: 'Need a different size? We cover 100% of return shipping labels.', icon: RotateCcw },
                    { title: 'Instant Store Credit', desc: 'Opt for JoshShoes Credit and receive an extra 10% bonus credit.', icon: Sparkles },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <item.icon className="w-5 h-5 text-orange-500 mb-2" />
                      <h5 className="font-bold text-xs uppercase tracking-wider mb-1 dark:text-white">{item.title}</h5>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {returnSubmitted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="text-lg font-bold dark:text-white">Return Request Authorized</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                      We've emailed a prepaid return shipping label to your account email. Please package the unworn item with original tags and drop off at any authorized FedEx outlet.
                    </p>
                    <button
                      onClick={() => setReturnSubmitted(false)}
                      className="text-xs font-bold text-orange-500 uppercase tracking-widest pt-2 underline"
                    >
                      Submit Another Return
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReturnSubmit} className="space-y-4 bg-zinc-50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Initiate a Return or Exchange</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-zinc-500">Order Number</label>
                        <input
                          type="text"
                          placeholder="e.g. JOSH-9821"
                          value={returnOrderId}
                          onChange={e => setReturnOrderId(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-zinc-500">Reason for Return</label>
                        <select
                          value={returnReason}
                          onChange={e => setReturnReason(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500 dark:text-white"
                        >
                          <option>Size too small</option>
                          <option>Size too large</option>
                          <option>Style/Color differed from expected</option>
                          <option>Defective item or stitching</option>
                          <option>Changed mind</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-colors shadow-sm"
                    >
                      Generate Prepaid Return Label
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 4. SIZE GUIDE */}
            {activeDoc === 'size-guide' && (
              <div className="space-y-6">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  JoshShoes shoes are crafted using true-to-size performance lasts. If you possess wide feet or plan to wear thick compression socks, we suggest sizing up by 0.5 US.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">US Men</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">US Women</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">UK</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">EU</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Foot Length (CM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                      {[
                        { usM: '7.0', usW: '8.5', uk: '6.0', eu: '40.0', cm: '25.0' },
                        { usM: '7.5', usW: '9.0', uk: '6.5', eu: '40.5', cm: '25.5' },
                        { usM: '8.0', usW: '9.5', uk: '7.0', eu: '41.0', cm: '26.0' },
                        { usM: '8.5', usW: '10.0', uk: '7.5', eu: '42.0', cm: '26.5' },
                        { usM: '9.0', usW: '10.5', uk: '8.0', eu: '42.5', cm: '27.0' },
                        { usM: '9.5', usW: '11.0', uk: '8.5', eu: '43.0', cm: '27.5' },
                        { usM: '10.0', usW: '11.5', uk: '9.0', eu: '44.0', cm: '28.0' },
                        { usM: '10.5', usW: '12.0', uk: '9.5', eu: '44.5', cm: '28.5' },
                        { usM: '11.0', usW: '12.5', uk: '10.0', eu: '45.0', cm: '29.0' },
                        { usM: '12.0', usW: '13.5', uk: '11.0', eu: '46.0', cm: '30.0' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-4 py-2.5 font-bold text-zinc-900 dark:text-white">{row.usM}</td>
                          <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{row.usW}</td>
                          <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{row.uk}</td>
                          <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{row.eu}</td>
                          <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400 font-mono">{row.cm} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. CONTACT US */}
            {activeDoc === 'contact' && (
              <div className="space-y-6">
                {contactSent ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="text-lg font-bold dark:text-white">Message Delivered</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                      Thank you for contacting JoshShoes Support. A dedicated specialist will review your inquiry and respond to <strong className="text-zinc-800 dark:text-zinc-200">{contactEmail}</strong> within 2 hours.
                    </p>
                    <button
                      onClick={() => setContactSent(false)}
                      className="text-xs font-bold text-orange-500 uppercase tracking-widest pt-2 underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-zinc-500">Your Email Address</label>
                        <input
                          type="email"
                          placeholder="you@joshshoes.com"
                          value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-zinc-500">Inquiry Type</label>
                        <select
                          value={contactCategory}
                          onChange={e => setContactCategory(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500 dark:text-white"
                        >
                          <option value="general">General Support</option>
                          <option value="order">Order Status & Shipping</option>
                          <option value="returns">Returns & Refunds</option>
                          <option value="wholesale">B2B / Wholesale Inquiries</option>
                          <option value="press">Press & Sponsorship</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-zinc-500">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Detail your question or request..."
                        value={contactMessage}
                        onChange={e => setContactMessage(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm p-4 rounded-xl focus:outline-none focus:border-orange-500 dark:text-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Message to Support</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 6. PRIVACY POLICY */}
            {activeDoc === 'privacy' && (
              <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <div className="flex items-center space-x-2 text-zinc-900 dark:text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>JoshShoes Privacy Policy & Data Protections (joshshoes.com)</span>
                </div>
                <p>Last updated: August 2026</p>

                <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider pt-2">1. Data Collection & Usage</h5>
                <p>
                  We collect personal details provided during purchase transactions (such as billing address, delivery coordinates, and email contact) solely to fulfill footwear orders, generate shipping manifests, and issue order tracking notifications.
                </p>

                <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider pt-2">2. Payment Security & Encryption</h5>
                <p>
                  All transaction processing occurs over 256-bit SSL encrypted pipelines. JoshShoes does not store complete credit card primary account numbers on local servers. Payment tokens are securely managed by PCI-DSS Level 1 compliant gateways.
                </p>

                <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider pt-2">3. Cookies & Analytics</h5>
                <p>
                  We utilize lightweight essential cookies to retain cart contents, store theme preferences (dark/light mode), and maintain wishlist items in client session state.
                </p>
              </div>
            )}

            {/* 7. TERMS OF SERVICE */}
            {activeDoc === 'terms' && (
              <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <div className="flex items-center space-x-2 text-zinc-900 dark:text-white font-bold text-sm">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>JoshShoes Terms of Service & Customer Conditions (joshshoes.com)</span>
                </div>
                <p>Effective Date: January 1, 2026</p>

                <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider pt-2">1. Ordering & Inventory Availability</h5>
                <p>
                  All orders are subject to stock verification and fraud risk evaluation. JoshShoes reserves the right to decline or limit order quantities on limited-edition sneaker drops.
                </p>

                <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider pt-2">2. Intellectual Property</h5>
                <p>
                  All proprietary shoe designs, 3D knit patterns, brand logos, trademarks, and original photography on joshshoes.com are exclusive intellectual property of JoshShoes Footwear Inc.
                </p>

                <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider pt-2">3. Limited Structural Warranty</h5>
                <p>
                  Products are warranted against manufacturing defects for 12 months. Normal athletic wear-and-tear or unrecommended machine washing voids warranty coverage.
                </p>
              </div>
            )}

            {/* 8. SHOE CARE & MAINTENANCE */}
            {activeDoc === 'care' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Keep your high-performance JoshShoes footwear looking fresh out of the box with our recommended maintenance protocols:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { step: '1. Knit Upper Cleaning', desc: 'Use a soft-bristle brush with lukewarm water and mild detergent. Gently scrub in circular motions. Air dry naturally away from direct heat.' },
                    { step: '2. Carbon Sole Shield', desc: 'Wipe the outsole and TPU shank plate using microfiber cloths to maintain traction grip and carbon flex elasticity.' },
                    { step: '3. Insole Hygiene', desc: 'Remove OrthoLite insoles periodically. Dust with baking soda or hand-wash in cold water to preserve cushioning density.' },
                    { step: '4. Storage Best Practices', desc: 'Insert shoe trees or paper stuffing to maintain upper shape. Store in a cool, moisture-controlled environment.' },
                  ].map((tip, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-orange-500 mb-1">{tip.step}</h5>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
            <span>Need further help? Contact us at support@joshshoes.com or visit joshshoes.com</span>
            <button
              onClick={onClose}
              className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
