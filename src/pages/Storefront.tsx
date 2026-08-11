import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Menu, X, ArrowRight, Star, Facebook, Twitter, Instagram, ChevronDown, Heart, Info, CheckCircle2, Scale, Sun, Moon, Eye } from 'lucide-react';
import heroImage from '../assets/images/futuristic_sneaker_hero_1785206911659.jpg';
import lifestyleImage from '../assets/images/lifestyle_sneaker_1785222576035.jpg';
import streetImage from '../assets/images/street_sneaker_1785222603342.jpg';
import pinkSneaker from '../assets/images/womens_pink_sneaker_1785242613934.jpg';
import greySneaker from '../assets/images/chunky_grey_sneaker_1785242628354.jpg';
import greenSneaker from '../assets/images/hightop_green_sneaker_1785242642967.jpg';

import CheckoutModal from '../components/CheckoutModal';
import ReviewSection from '../components/ReviewSection';
import FooterDocModal, { DocType } from '../components/FooterDocModal';
import { useStore } from '../context/StoreContext';

const REGIONS = ['US', 'UK', 'EU', 'CA', 'AU'];
const SIZES = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'];
const OUT_OF_STOCK_SIZES = ['9.5', '10.5'];
const COLORS = [
  { name: 'Neon Flare', class: 'bg-orange-500', image: heroImage },
  { name: 'Stealth', class: 'bg-zinc-900', image: streetImage },
  { name: 'Arctic', class: 'bg-zinc-100 border border-zinc-300', image: lifestyleImage }
];

const PRODUCT_TABS = ['New Arrivals', 'Men', 'Women', 'Collections'] as const;
type ProductTab = typeof PRODUCT_TABS[number];

const PRODUCTS: Record<ProductTab, { id: string, name: string, category: string, price: string, numericPrice: number, image: string }[]> = {
  'New Arrivals': [
    { id: 'na1', name: 'Quantum Velocity Plus', category: "Men's Running Shoe", price: '$260', numericPrice: 260, image: heroImage },
    { id: 'na2', name: 'CloudStride Pink', category: "Women's Running Shoe", price: '$220', numericPrice: 220, image: pinkSneaker },
    { id: 'na3', name: 'Urban High-Top', category: "Unisex Streetwear", price: '$240', numericPrice: 240, image: greenSneaker },
    { id: 'na4', name: 'Street Runner Max', category: "Men's Streetwear", price: '$210', numericPrice: 210, image: streetImage },
  ],
  'Men': [
    { id: 'm1', name: 'JoshShoes Lifestyle (M)', category: "Men's Casual Shoe", price: '$180', numericPrice: 180, image: lifestyleImage },
    { id: 'm2', name: 'Quantum Sprint', category: "Men's Track Shoe", price: '$190', numericPrice: 190, image: heroImage },
    { id: 'm3', name: 'Graphite Chunky', category: "Men's Streetwear", price: '$250', numericPrice: 250, image: greySneaker },
    { id: 'm4', name: 'Neon Court High', category: "Men's Basketball", price: '$230', numericPrice: 230, image: greenSneaker },
  ],
  'Women': [
    { id: 'w1', name: 'Velocity Stealth', category: "Women's Running Shoe", price: '$240', numericPrice: 240, image: streetImage },
    { id: 'w2', name: 'JoshShoes Lifestyle (W)', category: "Women's Casual Shoe", price: '$180', numericPrice: 180, image: lifestyleImage },
    { id: 'w3', name: 'Quantum Velocity Pink', category: "Women's Running Shoe", price: '$220', numericPrice: 220, image: pinkSneaker },
    { id: 'w4', name: 'CloudWalker Grey', category: "Women's Streetwear", price: '$250', numericPrice: 250, image: greySneaker },
  ],
  'Collections': [
    { id: 'c1', name: 'The Velocity Collection', category: 'Running Series', price: '$240+', numericPrice: 240, image: heroImage },
    { id: 'c2', name: 'The Lifestyle Series', category: 'Casual Wear', price: '$180+', numericPrice: 180, image: lifestyleImage },
    { id: 'c3', name: 'Urban Streetwear', category: 'Street Series', price: '$210+', numericPrice: 210, image: greenSneaker },
    { id: 'c4', name: 'Pro Carbon Edition', category: 'Elite Racing', price: '$260+', numericPrice: 260, image: greySneaker },
  ],
};

export default function Storefront() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('9');
  const [selectedColor, setSelectedColor] = useState('Neon Flare');
  const [activeTab, setActiveTab] = useState<ProductTab>('New Arrivals');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [categoryProgress, setCategoryProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [quickViewColor, setQuickViewColor] = useState<string | null>(null);
  const [quickViewSize, setQuickViewSize] = useState<string | null>(null);
  const [activeFooterDoc, setActiveFooterDoc] = useState<DocType>(null);
  
  const { wishlist, toggleWishlist: storeToggleWishlist, isDarkMode, toggleDarkMode, isCheckoutOpen, setIsCheckoutOpen, cart, addToCart } = useStore();

  const scrollToProducts = (tabName?: ProductTab) => {
    if (tabName) setActiveTab(tabName);
    document.getElementById('discover-more')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.5)'
    });
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  const handleNotifyMe = () => {
    if (notifyEmail) {
      setNotifySuccess(true);
      setTimeout(() => setNotifySuccess(false), 3000);
      setNotifyEmail('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ProductTab) => {
    if (tab === activeTab) return;
    setIsLoadingCategory(true);
    setCategoryProgress(0);
    
    const interval = setInterval(() => {
      setCategoryProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 30;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setCategoryProgress(100);
      setActiveTab(tab);
      setTimeout(() => {
        setIsLoadingCategory(false);
      }, 200);
    }, 600);
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    storeToggleWishlist(productId);
  };

  const toggleCompare = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length < 2) {
        return [...prev, product];
      }
      return [prev[1], product]; // Keep max 2
    });
  };

  const handleQuickView = (e: React.MouseEvent | undefined, product: any) => {
    if (e) e.stopPropagation();
    setQuickViewProduct(product);
    setQuickViewColor(null);
    setQuickViewSize(null);
  };

  const ALL_PRODUCTS = Array.from(
    new Map(
      Object.values(PRODUCTS)
        .flat()
        .map((p) => [p.id, p])
    ).values()
  );

  const displayedProducts = (searchQuery.trim() !== ''
    ? ALL_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PRODUCTS[activeTab]).filter(p => {
      const min = minPrice === '' ? 0 : Number(minPrice);
      const max = maxPrice === '' ? Infinity : Number(maxPrice);
      return p.numericPrice >= min && p.numericPrice <= max;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white flex flex-col transition-colors">
      {/* Loading Progress */}
      {isLoadingCategory && (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-zinc-100">
          <div 
            className="h-full bg-orange-500 transition-all duration-200 ease-out"
            style={{ width: `${categoryProgress}%` }}
          />
        </div>
      )}
      
      {/* Navigation & Top Bar */}
      <div className="fixed w-full z-50 flex flex-col">
        {/* Top Announcement Bar */}
        <div className="bg-zinc-900 text-zinc-300 py-2 px-6 lg:px-12 text-[10px] sm:text-xs font-medium tracking-wide flex justify-between items-center z-50 relative">
          <div className="hidden sm:flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Store Locator</a>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
          <div className="flex-1 text-center font-bold tracking-widest uppercase text-white">
            Free shipping on orders over $150
          </div>
          <div className="hidden sm:flex space-x-4 items-center">
            <button className="flex items-center hover:text-white transition-colors uppercase">
              USD <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            <button className="flex items-center hover:text-white transition-colors uppercase">
              EN <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="#" className="text-2xl font-black tracking-tighter uppercase">
                JoshShoes<span className="text-orange-500">.</span>
              </a>
            </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['New Arrivals', 'Men', 'Women', 'Collections'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-zinc-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-48 transition-all"
              />
            </div>
            
            <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={toggleDarkMode}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative" onClick={() => setIsCheckoutOpen(true)}>
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="text-zinc-900 relative">
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button className="text-zinc-900 dark:text-white relative" onClick={() => setIsCheckoutOpen(true)}>
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-[116px] px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6 text-xl font-bold tracking-tight uppercase">
              {['New Arrivals', 'Men', 'Women', 'Collections'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-900 hover:text-orange-500 transition-colors border-b border-zinc-100 pb-4"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 flex items-center space-x-4">
                <Search className="w-6 h-6 text-zinc-900" />
                <span className="text-lg">Search</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-[116px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[calc(100vh-116px)] items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1 pt-4 lg:pt-0 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm">
                  Redefining Speed
                </h2>
                <div className="hidden sm:block w-px h-4 bg-zinc-300"></div>
                <div className="flex items-center">
                  <div className="flex text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <a href="#reviews" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline ml-2 transition-colors">
                    Read 120 reviews
                  </a>
                </div>
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                QUANTUM<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                  VELOCITY
                </span>
              </h1>
              <p className="text-lg text-zinc-500 max-w-md mb-8 leading-relaxed">
                Experience the next evolution in performance running. Engineered with aerogel cushioning and a hyper-responsive carbon plate for ultimate momentum.
              </p>
              
              {/* Color Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between max-w-md mb-3">
                  <p className="text-xs font-bold tracking-widest uppercase">Color</p>
                  <p className="text-xs font-semibold text-zinc-500 uppercase">{selectedColor}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        selectedColor === c.name ? 'ring-2 ring-offset-2 ring-orange-500' : 'ring-1 ring-transparent hover:ring-zinc-300'
                      }`}
                      aria-label={`Select ${c.name} color`}
                    >
                      <span className={`w-8 h-8 rounded-full ${c.class}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-10 relative z-20">
                <div className="flex items-center justify-between max-w-md mb-3">
                  <div className="flex items-center space-x-4">
                    <p className="text-xs font-bold tracking-widest uppercase">Select Size</p>
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center tracking-widest uppercase transition-colors"
                    >
                      <Info className="w-3 h-3 mr-1" />
                      Size Guide
                    </button>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center tracking-widest uppercase transition-colors"
                    >
                      {selectedRegion} <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                    <AnimatePresence>
                      {isRegionDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 bg-white border border-zinc-100 shadow-xl rounded-lg overflow-hidden w-24"
                        >
                          {REGIONS.map(r => (
                            <button
                              key={r}
                              onClick={() => { setSelectedRegion(r); setIsRegionDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2 text-xs font-bold tracking-wider ${selectedRegion === r ? 'bg-orange-50 text-orange-500' : 'hover:bg-zinc-50 text-zinc-600'}`}
                            >
                              {r}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 max-w-md">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 text-sm font-bold transition-all border ${
                        selectedSize === s 
                          ? 'border-orange-500 bg-orange-500 text-white shadow-md' 
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-widest uppercase text-sm px-10 py-5 rounded-full transition-all flex items-center justify-center group shadow-[0_8px_30px_rgb(255,85,0,0.3)] hover:shadow-[0_8px_30px_rgb(255,85,0,0.5)] hover:-translate-y-1">
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center space-x-4 text-lg font-black tracking-widest">
                  <span className="text-zinc-900">$240.00</span>
                </div>
              </div>
            </motion.div>

            {/* Feature Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 pt-10 border-t border-zinc-100 max-w-md"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-black tracking-tighter">180g</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold mt-1">Weight</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black tracking-tighter">8mm</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold mt-1">Drop</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black tracking-tighter">Pro</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold mt-1">Carbon</p>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative order-1 lg:order-2 h-[45vh] lg:h-[80vh] w-full flex items-center justify-center [perspective:1000px] z-10">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full bg-gradient-to-tr from-orange-100/40 to-transparent blur-3xl -z-10 pointer-events-none"></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 10, rotateX: 5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: -5, 
                rotateX: 5,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              className="relative w-full h-full max-h-[700px] cursor-pointer"
            >
              <img
                src={COLORS.find(c => c.name === selectedColor)?.image || heroImage}
                alt="Quantum Velocity Running Shoe"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center rounded-3xl shadow-2xl transition-opacity duration-500"
              />
              
              {/* Floating UI Elements */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 top-1/4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center space-x-3 hidden sm:flex pointer-events-none"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 font-black">99%</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Energy Return</p>
                  <p className="text-sm font-black">AeroFoam+</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Product Showcase Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
            <div>
              <h2 id="discover-more" className="text-3xl sm:text-4xl font-black tracking-tighter mb-4">Discover More</h2>
              <p className="text-zinc-500 text-sm max-w-md">Explore our latest releases and signature collections designed for peak performance and everyday style.</p>
            </div>
            
            {/* Category Tabs & Filters */}
            <div className="flex flex-col md:items-end space-y-4">
              <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-6">
                {PRODUCT_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`text-sm font-bold uppercase tracking-widest whitespace-nowrap pb-2 border-b-2 transition-colors ${
                      activeTab === tab && searchQuery.trim() === ''
                        ? 'border-orange-500 text-zinc-900' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price Range:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-400 text-sm">$</span>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-16 px-2 py-1 bg-zinc-100 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <span className="text-zinc-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-16 px-2 py-1 bg-zinc-100 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="wait">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer flex flex-col h-full relative"
                  onClick={(e) => handleQuickView(e, product)}
                >
                  <div className="relative aspect-square mb-4 bg-zinc-100 rounded-2xl overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => toggleWishlist(e, product.id)}
                        className="p-2.5 bg-white/90 backdrop-blur rounded-full text-zinc-400 hover:text-orange-500 hover:scale-110 transition-all shadow-sm"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-orange-500 text-orange-500' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => toggleCompare(e, product)}
                        className={`p-2.5 bg-white/90 backdrop-blur rounded-full hover:scale-110 transition-all shadow-sm ${compareList.find(p => p.id === product.id) ? 'text-orange-500' : 'text-zinc-400 hover:text-orange-500'}`}
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    </div>
                    {product.id.startsWith('na') && (
                      <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                        New
                      </span>
                    )}
                    
                    {/* Quick View Button */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
                      <button 
                        onClick={(e) => handleQuickView(e, product)}
                        className="w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-xs py-3 rounded-xl shadow-lg hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-center space-x-2 group/btn shadow-orange-500/10"
                      >
                        <Eye className="w-4 h-4 text-orange-500 group-hover/btn:text-white transition-colors" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="text-lg font-black tracking-tight mb-1">{product.name}</h3>
                    <p className="text-sm font-bold text-zinc-500 mt-auto">{product.price}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-16 flex justify-center">
            <button className="border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-bold uppercase tracking-widest text-xs px-8 py-4 transition-all">
              View All Products
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white pt-24 pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-2xl font-black tracking-tighter uppercase mb-6 inline-block text-left">
              JoshShoes<span className="text-orange-500">.</span>
            </button>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 pr-4">
              Elevating performance footwear through relentless innovation and uncompromising design. Designed for those who push boundaries.
            </p>
            <div className="flex space-x-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><button onClick={() => scrollToProducts('New Arrivals')} className="hover:text-white transition-colors text-left">New Arrivals</button></li>
              <li><button onClick={() => scrollToProducts('Men')} className="hover:text-white transition-colors text-left">Men's Shoes</button></li>
              <li><button onClick={() => scrollToProducts('Women')} className="hover:text-white transition-colors text-left">Women's Shoes</button></li>
              <li><button onClick={() => scrollToProducts('Collections')} className="hover:text-white transition-colors text-left">Collections</button></li>
              <li><button onClick={() => setActiveFooterDoc('care')} className="hover:text-white transition-colors text-left">Care & Maintenance</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Support & Docs</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><button onClick={() => setActiveFooterDoc('help-center')} className="hover:text-white transition-colors text-left">Help Center & FAQ</button></li>
              <li><button onClick={() => setActiveFooterDoc('track-order')} className="hover:text-white transition-colors text-left">Track Order</button></li>
              <li><button onClick={() => setActiveFooterDoc('returns')} className="hover:text-white transition-colors text-left">Returns & Exchanges</button></li>
              <li><button onClick={() => setActiveFooterDoc('size-guide')} className="hover:text-white transition-colors text-left">Size Guide</button></li>
              <li><button onClick={() => setActiveFooterDoc('contact')} className="hover:text-white transition-colors text-left">Contact Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            {isSubscribed ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex items-center space-x-3 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded text-sm font-bold border border-emerald-500/20"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Successfully subscribed!</span>
              </motion.div>
            ) : (
              <form 
                className="flex flex-col space-y-3" 
                onSubmit={(e) => { e.preventDefault(); setIsSubscribed(true); }}
              >
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-white text-zinc-950 hover:bg-orange-500 hover:text-white font-bold uppercase tracking-widest text-xs px-4 py-3 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} JoshShoes Footwear (joshshoes.com). All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-zinc-500 uppercase tracking-wider">
            <a href="/admin" className="hover:text-white transition-colors">Admin Dashboard</a>
            <button onClick={() => setActiveFooterDoc('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveFooterDoc('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-zinc-900 text-white rounded-full shadow-xl hover:bg-orange-500 transition-colors"
          >
            <ArrowRight className="w-5 h-5 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl shadow-orange-500/10 max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div 
                className="w-full md:w-1/2 bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center p-8 overflow-hidden relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setIsZooming(true)}
              >
                <img 
                  src={quickViewColor ? COLORS.find(c => c.name === quickViewColor)?.image : quickViewProduct.image} 
                  alt={quickViewProduct.name} 
                  className={`w-full h-full object-cover rounded-2xl shadow-sm max-h-[50vh] md:max-h-full transition-transform duration-200 ease-out ${isZooming ? 'cursor-zoom-in' : 'mix-blend-multiply dark:mix-blend-normal'}`}
                  style={isZooming ? zoomStyle : {}}
                />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative overflow-y-auto">
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 p-2 rounded-full z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 mt-4 md:mt-0">{quickViewProduct.category}</p>
                <h3 className="text-3xl font-black tracking-tight mb-2 dark:text-white">{quickViewProduct.name}</h3>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">{quickViewProduct.price}</p>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
                  Experience ultimate performance and style with the {quickViewProduct.name}. Designed with precision engineering for maximum comfort, durability, and a premium streetwear aesthetic.
                </p>

                {/* Color Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold tracking-widest uppercase dark:text-zinc-300">Color</p>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">{quickViewColor || 'Original'}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setQuickViewColor(c.name)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          quickViewColor === c.name ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-zinc-900' : 'ring-1 ring-transparent hover:ring-zinc-300 dark:hover:ring-zinc-700'
                        }`}
                        aria-label={`Select ${c.name} color`}
                      >
                        <span className={`w-8 h-8 rounded-full ${c.class}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold tracking-widest uppercase dark:text-zinc-300">Select Size</p>
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center tracking-widest uppercase transition-colors"
                    >
                      <Info className="w-3 h-3 mr-1" />
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {SIZES.map((s) => {
                      const isOutOfStock = OUT_OF_STOCK_SIZES.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => setQuickViewSize(s)}
                          className={`py-2 text-xs font-bold rounded-lg transition-all relative ${
                            quickViewSize === s
                              ? 'bg-zinc-900 dark:bg-orange-500 text-white shadow-sm'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
                          }`}
                        >
                          {s}
                          {isOutOfStock && <span className="absolute inset-0 flex items-center justify-center opacity-50"><div className="w-full h-px bg-zinc-900 dark:bg-white rotate-45" /></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto space-y-4 pt-4">
                  {quickViewSize && OUT_OF_STOCK_SIZES.includes(quickViewSize) ? (
                    <div className="space-y-2">
                      <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden p-1">
                        <input 
                          type="email" 
                          placeholder="Email address"
                          value={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.value)}
                          className="w-full bg-transparent p-3 outline-none text-sm dark:text-white"
                        />
                        <button 
                          onClick={handleNotifyMe}
                          className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold uppercase tracking-widest text-xs px-4 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-500 transition-colors"
                        >
                          Notify
                        </button>
                      </div>
                      {notifySuccess && <p className="text-emerald-500 text-xs font-bold">We'll email you when it's back in stock!</p>}
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        addToCart({
                          id: quickViewProduct.id,
                          name: quickViewProduct.name,
                          price: quickViewProduct.price,
                          numericPrice: quickViewProduct.numericPrice,
                          image: quickViewColor ? COLORS.find(c => c.name === quickViewColor)?.image || quickViewProduct.image : quickViewProduct.image,
                          quantity: 1,
                          size: quickViewSize || undefined,
                          color: quickViewColor || undefined
                        });
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_4px_14px_rgb(255,85,0,0.3)] hover:shadow-[0_6px_20px_rgb(255,85,0,0.4)]"
                    >
                      Add to Cart / Checkout
                    </button>
                  )}
                  <button 
                    onClick={(e) => toggleWishlist(e, quickViewProduct.id)}
                    className={`w-full border-2 font-bold uppercase tracking-widest text-sm py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                      wishlist.includes(quickViewProduct.id) 
                        ? 'border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-500/10' 
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:border-zinc-900 dark:hover:border-zinc-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(quickViewProduct.id) ? 'fill-current' : ''}`} />
                    <span>{wishlist.includes(quickViewProduct.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                  
                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Share:</p>
                    <div className="flex space-x-4">
                      <button className="text-zinc-400 hover:text-orange-500 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button className="text-zinc-400 hover:text-orange-500 transition-colors">
                        <Instagram className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <ReviewSection productId={quickViewProduct.id} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col shadow-2xl max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <h3 className="text-xl font-black tracking-tight">Size Guide</h3>
                <button 
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 rounded-full hover:bg-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <p className="text-sm text-zinc-500 mb-6">
                  Use the chart below to find your correct size. Our shoes fit true to size. If you are between sizes, we recommend sizing up.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-100">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600">US</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600">UK</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600">EU</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600">CM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {[
                        { us: '7', uk: '6', eu: '40', cm: '25' },
                        { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.5' },
                        { us: '8', uk: '7', eu: '41', cm: '26' },
                        { us: '8.5', uk: '7.5', eu: '42', cm: '26.5' },
                        { us: '9', uk: '8', eu: '42.5', cm: '27' },
                        { us: '9.5', uk: '8.5', eu: '43', cm: '27.5' },
                        { us: '10', uk: '9', eu: '44', cm: '28' },
                        { us: '10.5', uk: '9.5', eu: '44.5', cm: '28.5' },
                        { us: '11', uk: '10', eu: '45', cm: '29' },
                        { us: '12', uk: '11', eu: '46', cm: '30' },
                      ].map((size, i) => (
                        <tr key={i} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-bold text-zinc-900">{size.us}</td>
                          <td className="px-4 py-3 text-sm text-zinc-600">{size.uk}</td>
                          <td className="px-4 py-3 text-sm text-zinc-600">{size.eu}</td>
                          <td className="px-4 py-3 text-sm text-zinc-600">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Compare Button */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-4 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl border border-zinc-800"
          >
            <div className="flex -space-x-3">
              {compareList.map((p, i) => (
                <img 
                  key={i} 
                  src={p.image} 
                  alt={p.name} 
                  className="w-10 h-10 rounded-full border-2 border-zinc-900 object-cover bg-white" 
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest">{compareList.length}/2 Selected</span>
              <span className="text-[10px] text-zinc-400">Add 2 items to compare</span>
            </div>
            <button 
              onClick={() => setIsCompareModalOpen(true)}
              disabled={compareList.length < 2}
              className="ml-4 bg-orange-500 disabled:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
            >
              Compare
            </button>
            <button 
              onClick={() => setCompareList([])}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareModalOpen && compareList.length === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
            onClick={() => setIsCompareModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <h3 className="text-xl font-black tracking-tight uppercase">Compare Products</h3>
                <button 
                  onClick={() => setIsCompareModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 rounded-full hover:bg-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 md:p-10 overflow-y-auto">
                <div className="grid grid-cols-2 gap-8 md:gap-16">
                  {compareList.map((product, idx) => (
                    <div key={idx} className="flex flex-col">
                      <div className="aspect-square bg-zinc-100 rounded-2xl overflow-hidden mb-6 relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
                        <button 
                          onClick={() => setCompareList(prev => prev.filter(p => p.id !== product.id))}
                          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-zinc-400 hover:text-red-500 shadow-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">{product.category}</p>
                      <h4 className="text-2xl font-black tracking-tighter mb-2">{product.name}</h4>
                      <p className="text-lg font-bold text-zinc-900 mb-8">{product.price}</p>
                      
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Weight</span>
                          <span className="font-bold">{idx === 0 ? '180g' : '210g'}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Drop</span>
                          <span className="font-bold">{idx === 0 ? '8mm' : '10mm'}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Cushioning</span>
                          <span className="font-bold">{idx === 0 ? 'Maximum' : 'Responsive'}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Material</span>
                          <span className="font-bold">{idx === 0 ? 'Engineered Mesh' : 'Primeknit'}</span>
                        </div>
                      </div>
                      
                      <button className="mt-8 w-full bg-zinc-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={quickViewProduct || { name: 'Item', price: '$0.00', image: '', category: '' }}
      />

      <FooterDocModal
        activeDoc={activeFooterDoc}
        onClose={() => setActiveFooterDoc(null)}
        onOpenDoc={setActiveFooterDoc}
      />
    </div>
  );
}
