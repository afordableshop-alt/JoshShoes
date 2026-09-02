import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Info, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBrand?: string;
}

const BRANDS = [
  { id: 'josh', name: 'JoshShoes Pro Line', note: 'Fits true to size. True anatomical toe box.' },
  { id: 'nike', name: 'Nike Equivalent', note: 'Standard athletic fit. Narrow arch curve.' },
  { id: 'adidas', name: 'Adidas Equivalent', note: 'Runs slightly wider in forefoot.' },
  { id: 'jordan', name: 'Jordan / High-Top Fit', note: 'Snug ankle lock. Recommend 1/2 size up for wide feet.' },
  { id: 'puma', name: 'Puma / Precision Fit', note: 'Sleek, low-profile performance wrap.' }
];

const SHOE_TYPES = [
  { id: 'running', name: 'Running & Racing', recommendation: 'Opt for 1/2 size larger than casual shoes to allow toe expansion during long runs.' },
  { id: 'basketball', name: 'Basketball & High-Top', recommendation: 'Order your exact true size for max ankle lockdown or 1/2 size up if wearing thick sports socks.' },
  { id: 'lifestyle', name: 'Lifestyle & Streetwear', recommendation: 'True to size fit. Soft padded linings settle comfortably after 1-2 wears.' },
  { id: 'outdoor', name: 'Trail & Hiking', recommendation: 'Size up 1/2 size to accommodate thick trail socks and steep downhill toe clearance.' }
];

const CONVERSIONS = [
  { us: '7.0', uk: '6.0', eu: '40.0', cm: '25.0', inches: '9.8"' },
  { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.5', inches: '10.0"' },
  { us: '8.0', uk: '7.0', eu: '41.0', cm: '26.0', inches: '10.2"' },
  { us: '8.5', uk: '7.5', eu: '42.0', cm: '26.5', inches: '10.4"' },
  { us: '9.0', uk: '8.0', eu: '42.5', cm: '27.0', inches: '10.6"' },
  { us: '9.5', uk: '8.5', eu: '43.0', cm: '27.5', inches: '10.8"' },
  { us: '10.0', uk: '9.0', eu: '44.0', cm: '28.0', inches: '11.0"' },
  { us: '10.5', uk: '9.5', eu: '44.5', cm: '28.5', inches: '11.2"' },
  { us: '11.0', uk: '10.0', eu: '45.0', cm: '29.0', inches: '11.4"' },
  { us: '12.0', uk: '11.0', eu: '46.0', cm: '30.0', inches: '11.8"' },
];

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [selectedBrand, setSelectedBrand] = useState('josh');
  const [selectedType, setSelectedType] = useState('running');
  const [footCm, setFootCm] = useState(27.0);

  if (!isOpen) return null;

  // Find matching size recommendation based on foot length
  const matchedSize = CONVERSIONS.reduce((prev, curr) => {
    return Math.abs(parseFloat(curr.cm) - footCm) < Math.abs(parseFloat(prev.cm) - footCm) ? curr : prev;
  });

  const activeBrandObj = BRANDS.find(b => b.id === selectedBrand) || BRANDS[0];
  const activeTypeObj = SHOE_TYPES.find(t => t.id === selectedType) || SHOE_TYPES[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Dynamic Size Guide & Fit Calculator"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-3xl overflow-hidden max-w-3xl w-full flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 my-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 sticky top-0 z-20">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-2xl">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase">Dynamic Size & Fit Calculator</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Precision measurement conversions and brand fit recommendations
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close size guide modal"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Interactive Selector Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brand Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                  1. Brand Comparison
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  aria-label="Select footwear brand for fit conversion"
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500 dark:text-white cursor-pointer"
                >
                  {BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Shoe Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                  2. Footwear Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  aria-label="Select shoe category for fit advice"
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500 dark:text-white cursor-pointer"
                >
                  {SHOE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Foot Measurement Calculator Slider */}
            <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                    Foot Length Calculator
                  </span>
                </div>
                <span className="text-sm font-black text-zinc-900 dark:text-white">
                  {footCm.toFixed(1)} cm / {((footCm / 2.54)).toFixed(1)}"
                </span>
              </div>

              <input
                type="range"
                min="24.0"
                max="30.0"
                step="0.5"
                value={footCm}
                onChange={(e) => setFootCm(parseFloat(e.target.value))}
                aria-label="Slide to select foot length in centimeters"
                className="w-full accent-orange-500 cursor-pointer"
              />

              <div className="flex items-center justify-between pt-2 border-t border-orange-500/20">
                <span className="text-xs text-zinc-500">Calculated Size:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-orange-500 text-white px-3 py-1 rounded-lg">
                    US {matchedSize.us}
                  </span>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    (UK {matchedSize.uk} / EU {matchedSize.eu})
                  </span>
                </div>
              </div>
            </div>

            {/* Fit Recommendations Alert Box */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
              <div className="flex items-center space-x-2 text-zinc-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Recommendation for {activeBrandObj.name} ({activeTypeObj.name})
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {activeBrandObj.note} {activeTypeObj.recommendation}
              </p>
            </div>

            {/* Full Conversion Matrix Table */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
                Full Size Conversion Matrix
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">US</th>
                      <th className="px-4 py-3">UK</th>
                      <th className="px-4 py-3">EU</th>
                      <th className="px-4 py-3">CM</th>
                      <th className="px-4 py-3">Inches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                    {CONVERSIONS.map((row) => {
                      const isMatch = row.us === matchedSize.us;
                      return (
                        <tr
                          key={row.us}
                          className={`transition-colors ${
                            isMatch
                              ? 'bg-orange-500/10 font-bold text-orange-500'
                              : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <td className="px-4 py-3 font-bold">{row.us} {isMatch && '★'}</td>
                          <td className="px-4 py-3">{row.uk}</td>
                          <td className="px-4 py-3">{row.eu}</td>
                          <td className="px-4 py-3">{row.cm} cm</td>
                          <td className="px-4 py-3">{row.inches}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
