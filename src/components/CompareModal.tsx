import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Scale, ShoppingBag, Plus } from 'lucide-react';
import ProductRadarChart, { PRODUCT_PERFORMANCE_DATA } from './ProductRadarChart';
import { useStore } from '../context/StoreContext';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  numericPrice: number;
  image: string;
}

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: ProductItem[];
  allProducts: ProductItem[];
  onRemoveFromCompare: (id: string) => void;
  onAddToCompare: (product: ProductItem) => void;
}

const SPEC_DETAILS: Record<string, {
  weight: string;
  cushioning: string;
  support: string;
  drop: string;
  material: string;
  outsole: string;
  bestFor: string;
}> = {
  'Quantum Velocity Plus': {
    weight: '240g (Lightweight)',
    cushioning: 'Maximal Nitrogen Foam',
    support: 'Neutral / High Arch Support',
    drop: '8mm',
    material: 'Engineered Aerodynamic FlyMesh',
    outsole: 'High-Traction Carbon Rubber',
    bestFor: 'Marathon & Speed Training'
  },
  'CloudStride Pink': {
    weight: '210g (Ultra Light)',
    cushioning: 'Plush Cloudfoam Matrix',
    support: 'Moderate Stability',
    drop: '10mm',
    material: 'Breathable Eco-Knit Upper',
    outsole: 'Responsive Flex-Grid Rubber',
    bestFor: 'Daily Running & Fitness'
  },
  'Urban High-Top': {
    weight: '320g (Durable High-Top)',
    cushioning: 'Impact Absorption EVA',
    support: 'Ankle Lock High Support',
    drop: '6mm',
    material: 'Water-Resistant Ripstop Canvas',
    outsole: 'Rugged Street Grip Pattern',
    bestFor: 'Urban Streetwear & Skateboard'
  },
  'Street Runner Max': {
    weight: '260g (Balanced)',
    cushioning: 'Dual-Density Foam Core',
    support: 'Dynamic Medial Support',
    drop: '8mm',
    material: 'Reinforced Jacquard Mesh',
    outsole: 'All-Weather Rubber Tread',
    bestFor: 'All-Day Wear & City Running'
  },
  'JoshShoes Lifestyle (M)': {
    weight: '275g (Classic Casual)',
    cushioning: 'Memory Foam Insole',
    support: 'Standard Neutral Fit',
    drop: '10mm',
    material: 'Premium Vegan Nappa Leather',
    outsole: 'Non-Marking Cupsole',
    bestFor: 'Casual Commute & Everyday'
  },
  'Quantum Sprint': {
    weight: '225g (Featherweight)',
    cushioning: 'Carbon-Infused Spring Foam',
    support: 'Performance Locked-in Heel',
    drop: '6mm',
    material: 'Ultra-Ventilated Mesh',
    outsole: 'Spike-Inspired Speed Grip',
    bestFor: 'Track Sprints & Tempo Runs'
  },
  'Graphite Chunky': {
    weight: '340g (Heavy Chunky)',
    cushioning: 'Chunky Multi-Layer Cushion',
    support: 'Wide Platform Stability',
    drop: '12mm',
    material: 'Layered Suede & Technical Mesh',
    outsole: 'Chunky Treaded Rubber',
    bestFor: 'Fashion Streetwear & Walking'
  },
  'Neon Court High': {
    weight: '310g (Support High)',
    cushioning: 'Responsive Air-Pod Cushion',
    support: 'Lateral Torsion Control',
    drop: '8mm',
    material: 'Synthetic Leather & Knit Collar',
    outsole: 'Herringbone Multi-Directional',
    bestFor: 'Basketball & High-Impact Sport'
  }
};

export default function CompareModal({
  isOpen,
  onClose,
  compareList,
  allProducts,
  onRemoveFromCompare,
  onAddToCompare
}: CompareModalProps) {
  const { addToCart, setIsCheckoutOpen } = useStore();

  if (!isOpen) return null;

  const availableToAdd = allProducts.filter(p => !compareList.some(c => c.id === p.id));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Side-by-Side Product Specifications Comparison Table"
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-3xl overflow-hidden max-w-6xl w-full flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 my-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 sticky top-0 z-20">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-2xl">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase">Side-by-Side Shoe Comparison</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Comparing {compareList.length} models side-by-side (up to 4 items)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close product comparison view"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Container */}
          <div className="p-6 overflow-x-auto overflow-y-auto">
            {compareList.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">No shoes selected for comparison</p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">Select at least two shoes from the catalog to compare specifications side-by-side.</p>
              </div>
            ) : (
              <div className="min-w-[650px] space-y-8">
                {/* Product Cards Row */}
                <div className="grid grid-cols-5 gap-4 items-start">
                  <div className="col-span-1 pt-4">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400 block mb-1">
                      Product Overview
                    </span>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Selected Models</h4>
                  </div>

                  {compareList.map((product) => (
                    <div key={product.id} className="col-span-1 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 flex flex-col justify-between h-full relative group">
                      <button
                        onClick={() => onRemoveFromCompare(product.id)}
                        aria-label={`Remove ${product.name} from comparison`}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-zinc-800/90 text-zinc-400 hover:text-red-500 rounded-full shadow-sm cursor-pointer z-10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>

                      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block">
                        {product.category}
                      </span>
                      <h5 className="font-black text-sm tracking-tight mb-1">{product.name}</h5>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">{product.price}</p>

                      <button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            numericPrice: product.numericPrice,
                            image: product.image,
                            quantity: 1,
                            size: '9'
                          });
                          onClose();
                          setIsCheckoutOpen(true);
                        }}
                        aria-label={`Buy ${product.name} now`}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer mt-auto"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  ))}

                  {/* Slot to add another shoe if < 4 */}
                  {compareList.length < 4 && availableToAdd.length > 0 && (
                    <div className="col-span-1 p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Add Shoe</span>
                      <select
                        onChange={(e) => {
                          const p = availableToAdd.find(item => item.id === e.target.value);
                          if (p) onAddToCompare(p);
                        }}
                        defaultValue=""
                        aria-label="Add shoe model to comparison table"
                        className="w-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="" disabled>+ Choose shoe...</option>
                        {availableToAdd.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.price})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Radar Performance Comparison */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-4">
                    Visual Performance Spectrum (Radar Analysis)
                  </h4>
                  <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-2' : compareList.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    {compareList.map(p => (
                      <div key={p.id} className="bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl p-2 border border-zinc-200 dark:border-zinc-700">
                        <p className="text-xs font-bold text-center mb-1 text-zinc-700 dark:text-zinc-300">{p.name}</p>
                        <ProductRadarChart productName={p.name} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications Comparison Table */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-4">
                    Technical Specifications
                  </h4>
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                      {[
                        { label: 'Weight', key: 'weight' },
                        { label: 'Cushioning', key: 'cushioning' },
                        { label: 'Arch Support', key: 'support' },
                        { label: 'Heel Drop', key: 'drop' },
                        { label: 'Upper Material', key: 'material' },
                        { label: 'Outsole Traction', key: 'outsole' },
                        { label: 'Best For Activity', key: 'bestFor' },
                      ].map((spec) => (
                        <tr key={spec.key} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-2 font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider w-1/5">
                            {spec.label}
                          </td>
                          {compareList.map((product) => {
                            const details = SPEC_DETAILS[product.name] || {
                              weight: '250g',
                              cushioning: 'Responsive Foam',
                              support: 'Neutral Support',
                              drop: '8mm',
                              material: 'Engineered Mesh',
                              outsole: 'Durable Rubber',
                              bestFor: 'All-Around Performance'
                            };
                            return (
                              <td key={product.id} className="py-3 px-2 font-medium text-zinc-900 dark:text-zinc-100">
                                {details[spec.key as keyof typeof details]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
