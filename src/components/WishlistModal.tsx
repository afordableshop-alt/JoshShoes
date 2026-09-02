import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const SIZES = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'];

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  numericPrice: number;
  image: string;
}

interface WishlistModalProps {
  allProducts: ProductItem[];
  onQuickView?: (product: ProductItem) => void;
}

export default function WishlistModal({ allProducts, onQuickView }: WishlistModalProps) {
  const { wishlist, toggleWishlist, clearWishlist, isWishlistOpen, setIsWishlistOpen, addToCart, setIsCheckoutOpen } = useStore();

  if (!isWishlistOpen) return null;

  // Filter unique matched items from wishlist IDs
  const wishlistProducts = allProducts.filter((p, index, self) => 
    wishlist.includes(p.id) && self.findIndex(t => t.id === p.id) === index
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Saved Wishlist Overlay"
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto"
        onClick={() => setIsWishlistOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-3xl overflow-hidden max-w-3xl w-full flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[85vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-2xl">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase">Saved Wishlist</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'favorite shoe' : 'favorite shoes'} saved
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {wishlistProducts.length > 0 && (
                <button
                  onClick={clearWishlist}
                  aria-label="Clear all items from wishlist"
                  className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
              <button
                onClick={() => setIsWishlistOpen(false)}
                aria-label="Close wishlist overlay"
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold uppercase tracking-tight mb-2">Your wishlist is empty</h4>
                <p className="text-sm text-zinc-500 max-w-sm mb-6">
                  Save your top footwear favorites by clicking the heart icon on any shoe card.
                </p>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    document.getElementById('discover-more')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="Explore catalog to save shoes"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-lg shadow-orange-500/20 cursor-pointer flex items-center space-x-2"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-orange-500/50 transition-all"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div 
                        onClick={() => {
                          if (onQuickView) onQuickView(product);
                          setIsWishlistOpen(false);
                        }}
                        className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-800 overflow-hidden flex-shrink-0 cursor-pointer relative"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block">
                          {product.category}
                        </span>
                        <h4 
                          onClick={() => {
                            if (onQuickView) onQuickView(product);
                            setIsWishlistOpen(false);
                          }}
                          className="font-black text-base tracking-tight hover:text-orange-500 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                          {product.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-700">
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
                          setIsWishlistOpen(false);
                          setIsCheckoutOpen(true);
                        }}
                        aria-label={`Add ${product.name} to cart and proceed to checkout`}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Remove ${product.name} from saved wishlist`}
                        className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                Items saved in wishlist persist across sessions automatically.
              </p>
              <button
                onClick={() => {
                  wishlistProducts.forEach(product => {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      numericPrice: product.numericPrice,
                      image: product.image,
                      quantity: 1,
                      size: '9'
                    });
                  });
                  setIsWishlistOpen(false);
                  setIsCheckoutOpen(true);
                }}
                aria-label="Move all wishlist items to cart"
                className="w-full sm:w-auto bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Add All To Cart
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
