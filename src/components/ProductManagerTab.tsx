import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import seasonalHeroBanner from '../assets/images/seasonal_hero_banner_1786448302735.jpg';
import { 
  Package, 
  Upload, 
  Globe, 
  FileText, 
  Edit3, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Copy, 
  Sparkles, 
  DollarSign, 
  Tag, 
  Layers, 
  Sliders, 
  AlertCircle, 
  Check, 
  Download, 
  Image as ImageIcon,
  ExternalLink,
  Receipt,
  Scan,
  ShieldCheck,
  Eye,
  ArrowRight,
  Percent,
  Flame,
  TrendingDown
} from 'lucide-react';

export interface ProductSchema {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  numericPrice: number;
  originalPrice?: number;
  salePrice?: number;
  isOnSale?: boolean;
  sku: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
  stock: number;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  features: string[];
  receiptMetadata?: {
    merchant?: string;
    invoiceNo?: string;
    purchaseDate?: string;
    unitCost?: number;
    tax?: number;
    totalPaid?: number;
  };
}

const INITIAL_CATALOG: ProductSchema[] = [
  {
    id: 'PROD-101',
    name: 'Quantum Velocity Plus',
    brand: 'JoshShoes Elite',
    category: "Men's Running Shoe",
    price: '$260',
    numericPrice: 260,
    originalPrice: 300,
    salePrice: 219.99,
    isOnSale: true,
    sku: 'JOSH-QV-001',
    status: 'Active',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    description: 'Next-generation marathon runner featuring carbon fiber propulsion plate and dual-density nitrogen injected foam midsole for maximum energy return.',
    sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colors: ['Neon Orange', 'Stealth Black', 'Arctic White'],
    features: ['Full-length carbon fiber propulsion plate', 'Breathable engineered monomesh upper', 'Nitrogen-infused ultra-light foam', 'High-abrasion rubber outsole'],
    receiptMetadata: {
      merchant: 'JoshShoes Athletics Supply Co.',
      invoiceNo: 'INV-2026-9901',
      purchaseDate: '2026-07-15',
      unitCost: 130,
      tax: 10.40,
      totalPaid: 140.40
    }
  },
  {
    id: 'PROD-102',
    name: 'CloudStride Pink',
    brand: 'JoshShoes Women',
    category: "Women's Running Shoe",
    price: '$220',
    numericPrice: 220,
    originalPrice: 250,
    salePrice: 189.99,
    isOnSale: true,
    sku: 'JOSH-CSP-002',
    status: 'Active',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    description: 'Ultra-cushioned road trainer engineered specifically for women. High-frequency heel counter minimizes slipping while soft collar wraps comfortably.',
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9'],
    colors: ['Rose Pink', 'Cloud White', 'Lavender Tint'],
    features: ['Anatomical arch support design', 'Impact-absorbing cloud foam pod soles', 'Reflective 3M detailing for night visibility', 'Antimicrobial ortholite sockliner']
  },
  {
    id: 'PROD-103',
    name: 'Urban High-Top Streetwear',
    brand: 'JoshShoes Street',
    category: 'Unisex Streetwear',
    price: '$240',
    numericPrice: 240,
    originalPrice: 270,
    salePrice: 199.99,
    isOnSale: true,
    sku: 'JOSH-UHT-003',
    status: 'Active',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
    description: 'Premium full-grain leather high-top sneaker inspired by vintage basketball heritage fused with minimalist luxury street design.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Emerald Green', 'Chalk White', 'Obsidian'],
    features: ['Handcrafted full-grain leather construction', 'Padded collar & dual strap lock system', 'Siped rubber cupsole for maximum traction', 'Custom debossed silver foil branding']
  }
];

const SAMPLE_RECEIPT_TEXT = `RECEIPT / INVOICE #JOSH-RC-88120
MERCHANT: GLOBAL ATHLETIC SUPPLIERS LTD.
DATE: AUGUST 09, 2026
PAYMENT: CREDIT CARD (VISA - 4891)

ITEMS PURCHASED:
1. ITEM SKU: SNEAK-PRO-2026-BLK
   NAME: Pro Velocity Carbon Edition
   BRAND: JoshShoes Tech
   CATEGORY: Men's Track & Field
   QTY: 50 UNITS
   UNIT PRICE: $140.00
   MSRP: $280.00
   SIZES: 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
   COLORS: Midnight Charcoal, Crimson Flare
   FEATURES: Ultra-light carbon plate, Hydrophobic knit upper, Race-grade spike lugs

FINANCIAL SUMMARY:
SUBTOTAL: $7,000.00
TAX (8.25%): $577.50
SHIPPING & HANDLING: $120.00
TOTAL PAID: $7,697.50`;

export default function ProductManagerTab() {
  const [products, setProducts] = useState<ProductSchema[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'editor' | 'scraper' | 'uploader'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Editor State
  const [editingProduct, setEditingProduct] = useState<ProductSchema>({
    id: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    brand: 'JoshShoes',
    category: "Men's Running Shoe",
    price: '$200',
    numericPrice: 200,
    originalPrice: 240,
    sku: `JOSH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Active',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    description: '',
    sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11'],
    colors: ['Neon Flare', 'Stealth Black'],
    features: ['High-traction outsole', 'Responsive cushioning', 'Breathable upper']
  });

  const [newSizeInput, setNewSizeInput] = useState('');
  const [newColorInput, setNewColorInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [editorSuccessMsg, setEditorSuccessMsg] = useState('');

  // Scraper State
  const [scraperMode, setScraperMode] = useState<'url' | 'receipt'>('receipt');
  const [scrapeUrlInput, setScrapeUrlInput] = useState('https://nike.com/t/air-max-velocity-runner');
  const [scrapeReceiptInput, setScrapeReceiptInput] = useState(SAMPLE_RECEIPT_TEXT);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [scrapedResult, setScrapedResult] = useState<ProductSchema | null>(null);

  // Uploader State
  const [jsonUploadInput, setJsonUploadInput] = useState('');
  const [uploadPreview, setUploadPreview] = useState<ProductSchema[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('josh_admin_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        setProducts(INITIAL_CATALOG);
      }
    } else {
      setProducts(INITIAL_CATALOG);
      localStorage.setItem('josh_admin_products', JSON.stringify(INITIAL_CATALOG));
    }
  }, []);

  const saveCatalogToStorage = (updated: ProductSchema[]) => {
    setProducts(updated);
    localStorage.setItem('josh_admin_products', JSON.stringify(updated));
  };

  // Editor Actions
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) return;

    const formattedPrice = editingProduct.price.startsWith('$') 
      ? editingProduct.price 
      : `$${editingProduct.numericPrice.toFixed(0)}`;

    const productToSave: ProductSchema = {
      ...editingProduct,
      price: formattedPrice
    };

    const existsIndex = products.findIndex(p => p.id === productToSave.id);
    let updated: ProductSchema[];
    if (existsIndex >= 0) {
      updated = [...products];
      updated[existsIndex] = productToSave;
    } else {
      updated = [productToSave, ...products];
    }

    saveCatalogToStorage(updated);
    setEditorSuccessMsg('Product saved and published to catalog!');
    setTimeout(() => setEditorSuccessMsg(''), 3000);
  };

  const handleEditProductClick = (product: ProductSchema) => {
    setEditingProduct(product);
    setActiveSubTab('editor');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product from catalog?')) {
      const updated = products.filter(p => p.id !== id);
      saveCatalogToStorage(updated);
    }
  };

  const handleNewProductInit = () => {
    setEditingProduct({
      id: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      brand: 'JoshShoes',
      category: "Men's Running Shoe",
      price: '$200',
      numericPrice: 200,
      originalPrice: 240,
      sku: `JOSH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      description: '',
      sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11'],
      colors: ['Neon Orange', 'Stealth Black'],
      features: ['High-traction rubber outsole', 'Responsive nitrogen foam midsole', 'Breathable engineered mesh upper']
    });
    setActiveSubTab('editor');
  };

  // Scraper Actions
  const handleRunScraper = () => {
    setIsScraping(true);
    setScrapeProgress(10);

    const timer = setInterval(() => {
      setScrapeProgress(prev => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(timer);
      setScrapeProgress(100);
      setIsScraping(false);

      if (scraperMode === 'receipt') {
        // Receipt OCR parsing simulation
        const parsed: ProductSchema = {
          id: `PROD-RC-${Math.floor(1000 + Math.random() * 9000)}`,
          name: 'Pro Velocity Carbon Edition',
          brand: 'JoshShoes Tech',
          category: "Men's Track & Field",
          price: '$280',
          numericPrice: 280,
          originalPrice: 320,
          sku: 'SNEAK-PRO-2026-BLK',
          status: 'Active',
          stock: 50,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
          description: 'Parsed from Supplier Invoice #JOSH-RC-88120. Race-ready carbon fiber plate sneaker with ultra-responsive energy return and spike-grade traction.',
          sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
          colors: ['Midnight Charcoal', 'Crimson Flare'],
          features: ['Ultra-light carbon plate', 'Hydrophobic knit upper', 'Race-grade spike lugs', 'Supplier verified provenance'],
          receiptMetadata: {
            merchant: 'GLOBAL ATHLETIC SUPPLIERS LTD.',
            invoiceNo: '#JOSH-RC-88120',
            purchaseDate: '2026-08-09',
            unitCost: 140.00,
            tax: 577.50,
            totalPaid: 7697.50
          }
        };
        setScrapedResult(parsed);
      } else {
        // E-Commerce Web Page Scraper simulation
        const parsed: ProductSchema = {
          id: `PROD-WEB-${Math.floor(1000 + Math.random() * 9000)}`,
          name: 'Air Max Velocity Turbo',
          brand: 'JoshShoes Web Scraped',
          category: "Unisex Streetwear",
          price: '$250',
          numericPrice: 250,
          originalPrice: 290,
          sku: `WEB-SCR-${Math.floor(100 + Math.random() * 900)}`,
          status: 'Active',
          stock: 35,
          image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&q=80',
          description: 'Scraped directly from web URL payload. Features 360-degree Air cushioning, TPU cage lockdown, and high-visibility metallic silver accents.',
          sizes: ['7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
          colors: ['Metallic Silver', 'Neon Yellow', 'Obsidian Black'],
          features: ['360-degree visible Air Max cushioning unit', 'Molded TPU midfoot cage for locked-in support', 'High-friction waffle traction rubber']
        };
        setScrapedResult(parsed);
      }
    }, 1500);
  };

  const handleApplyScrapedToEditor = () => {
    if (scrapedResult) {
      setEditingProduct(scrapedResult);
      setActiveSubTab('editor');
    }
  };

  const handlePublishScrapedDirect = () => {
    if (scrapedResult) {
      const updated = [scrapedResult, ...products];
      saveCatalogToStorage(updated);
      setScrapedResult(null);
      setActiveSubTab('catalog');
    }
  };

  // Uploader Actions
  const handleParseJsonUpload = () => {
    try {
      const parsed = JSON.parse(jsonUploadInput);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      
      const validated: ProductSchema[] = items.map((item, idx) => ({
        id: item.id || `PROD-UP-${Date.now()}-${idx}`,
        name: item.name || 'Uploaded Custom Shoe',
        brand: item.brand || 'JoshShoes Custom',
        category: item.category || "Men's Running Shoe",
        price: item.price || '$200',
        numericPrice: Number(item.numericPrice || item.price?.replace(/[^0-9.]/g, '') || 200),
        originalPrice: item.originalPrice || 240,
        sku: item.sku || `UP-SKU-${idx + 100}`,
        status: item.status || 'Active',
        stock: item.stock || 15,
        image: item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        description: item.description || 'Uploaded via bulk JSON schema parser.',
        sizes: Array.isArray(item.sizes) ? item.sizes : ['8', '9', '10', '11'],
        colors: Array.isArray(item.colors) ? item.colors : ['Default Color'],
        features: Array.isArray(item.features) ? item.features : ['Premium build quality']
      }));

      setUploadPreview(validated);
    } catch (e) {
      alert('Invalid JSON format. Please provide valid JSON array of products.');
    }
  };

  const handleCommitBulkUpload = () => {
    if (uploadPreview.length === 0) return;
    const updated = [...uploadPreview, ...products];
    saveCatalogToStorage(updated);
    setUploadSuccess(`Successfully imported ${uploadPreview.length} products to catalog!`);
    setUploadPreview([]);
    setJsonUploadInput('');
    setTimeout(() => {
      setUploadSuccess('');
      setActiveSubTab('catalog');
    }, 2000);
  };

  const handleCopySampleTemplate = () => {
    const template = [
      {
        id: "PROD-BULK-001",
        name: "Quantum Ultra Carbon",
        brand: "JoshShoes Pro",
        category: "Men's Track & Field",
        price: "$290",
        numericPrice: 290,
        originalPrice: 330,
        sku: "JOSH-CARBON-01",
        status: "Active",
        stock: 30,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        description: "Bulk uploaded high performance carbon runner.",
        sizes: ["8", "8.5", "9", "9.5", "10", "11"],
        colors: ["Neon Fire", "Stealth Gray"],
        features: ["Carbon shank", "Nitrogen foam"]
      }
    ];
    const str = JSON.stringify(template, null, 2);
    navigator.clipboard.writeText(str);
    setJsonUploadInput(str);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCatalog = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-zinc-900 dark:text-zinc-100">
      {/* Top Section Navigation Tabs */}
      <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'catalog'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Package className="w-4 h-4 text-orange-500" />
            <span>Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'editor'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Edit3 className="w-4 h-4 text-orange-500" />
            <span>Product Editor</span>
          </button>

          <button
            onClick={() => setActiveSubTab('scraper')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'scraper'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Scan className="w-4 h-4 text-orange-500" />
            <span>Scraper & Receipt Scanner</span>
          </button>

          <button
            onClick={() => setActiveSubTab('uploader')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'uploader'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Upload className="w-4 h-4 text-orange-500" />
            <span>Product Uploader</span>
          </button>
        </div>

        <button
          onClick={handleNewProductInit}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* SUB-TAB 1: CATALOG INVENTORY LIST */}
      {activeSubTab === 'catalog' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Header Controls */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-50/50 dark:bg-zinc-800/40">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products by title, SKU..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-500 font-bold uppercase">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Men's Running Shoe">Men's Running Shoe</option>
                  <option value="Women's Running Shoe">Women's Running Shoe</option>
                  <option value="Unisex Streetwear">Unisex Streetwear</option>
                  <option value="Men's Track & Field">Men's Track & Field</option>
                  <option value="On Sale">On Sale Items Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">SKU & Category</th>
                  <th className="px-6 py-4">Regular Price / MSRP</th>
                  <th className="px-6 py-4">Sale Price / Offer</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs font-medium">
                {filteredCatalog.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      No products found matching filters. Try creating a new product or scanning a receipt.
                    </td>
                  </tr>
                ) : (
                  filteredCatalog.map(p => {
                    const hasSale = p.isOnSale && p.salePrice && p.salePrice < p.numericPrice;
                    const discountPercent = hasSale && p.numericPrice 
                      ? Math.round(((p.numericPrice - p.salePrice!) / p.numericPrice) * 100) 
                      : 0;

                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0" />
                            <div>
                              <p className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                                {p.name}
                                {hasSale && (
                                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                                    <Flame className="w-2.5 h-2.5" /> Sale
                                  </span>
                                )}
                              </p>
                              <p className="text-zinc-500 text-[11px]">{p.brand}</p>
                              {p.receiptMetadata?.merchant && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full mt-1">
                                  <Receipt className="w-3 h-3" /> Scraped Receipt Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{p.sku}</p>
                          <p className="text-zinc-500 text-[11px]">{p.category}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`font-bold text-sm ${hasSale ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                            {p.price}
                          </p>
                          {p.originalPrice && (
                            <p className="text-zinc-400 text-[11px]">MSRP: ${p.originalPrice.toFixed(2)}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {hasSale ? (
                            <div>
                              <p className="font-black text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                {p.salePrice?.toFixed(2)}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <TrendingDown className="w-3 h-3" /> Save {discountPercent}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-[11px] italic">Standard Price</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${p.stock < 10 ? 'text-amber-500' : 'text-zinc-900 dark:text-white'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                            p.status === 'Draft' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit in Product Editor"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRODUCT EDITOR (Live Schema Parameter Editor) */}
      {activeSubTab === 'editor' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
          {/* SEASONAL HERO BANNER STAGE IN PRODUCT EDITOR */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl group">
            <img 
              src={seasonalHeroBanner} 
              alt="Seasonal Campaign Hero Banner"
              referrerPolicy="no-referrer"
              className="w-full h-52 md:h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/30 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="bg-orange-500/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Seasonal Footwear Campaign Editor
                </span>
                
                {editingProduct.isOnSale && editingProduct.salePrice && (
                  <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <Flame className="w-4 h-4" /> Active Sale Price: ${editingProduct.salePrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="max-w-2xl text-white space-y-1">
                <p className="text-xs font-extrabold text-orange-400 uppercase tracking-widest">Autumn / Winter Footwear Collection Showcase</p>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
                  {editingProduct.name || 'Untitled Shoe Product'}
                </h2>
                <p className="text-xs text-zinc-300 line-clamp-1 max-w-xl">
                  {editingProduct.description || 'Configure product details, pricing schema, sale discounts, and variants below.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-300 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-400" />
                  <span>Category: <strong className="text-white">{editingProduct.category}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Regular: <strong className="text-white">${editingProduct.numericPrice}</strong></span>
                </div>
                {editingProduct.originalPrice && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400">MSRP: <span className="line-through">${editingProduct.originalPrice.toFixed(2)}</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center space-x-3">
              <Edit3 className="w-6 h-6 text-orange-500" />
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Product Schema & Pricing Editor</h3>
                <p className="text-xs text-zinc-500">Edit and populate every required schema parameter, regular price, and sale price</p>
              </div>
            </div>

            {editorSuccessMsg && (
              <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {editorSuccessMsg}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-6">
            {/* Basic Info & Pricing Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> 1. Core Product Parameters & Sale Pricing
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Quantum Velocity Ultra"
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    placeholder="e.g. JoshShoes Elite"
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Men's Running Shoe">Men's Running Shoe</option>
                    <option value="Women's Running Shoe">Women's Running Shoe</option>
                    <option value="Unisex Streetwear">Unisex Streetwear</option>
                    <option value="Men's Track & Field">Men's Track & Field</option>
                    <option value="Women's Casual Shoe">Women's Casual Shoe</option>
                    <option value="Basketball Series">Basketball Series</option>
                  </select>
                </div>
              </div>

              {/* Price Row including Regular, Sale Price, MSRP, and Flash Sale Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Regular Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.numericPrice}
                    onChange={e => {
                      const num = parseFloat(e.target.value) || 0;
                      setEditingProduct({ 
                        ...editingProduct, 
                        numericPrice: num,
                        price: `$${num.toFixed(0)}`
                      });
                    }}
                    className="w-full p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-red-500 mb-1 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.salePrice || ''}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setEditingProduct({ 
                        ...editingProduct, 
                        salePrice: isNaN(val) ? undefined : val,
                        isOnSale: !isNaN(val) && val < editingProduct.numericPrice
                      });
                    }}
                    placeholder="e.g. 199.99"
                    className="w-full p-3 bg-white dark:bg-zinc-800 border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 font-black rounded-xl text-xs outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">MSRP / Original Price ($)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g. 280"
                    className="w-full p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">SKU Number</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-mono font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Flash Sale Active Toggle Banner */}
              <div className="mt-3 flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-200 dark:border-orange-500/20 text-xs">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    id="isOnSaleCheck"
                    checked={!!editingProduct.isOnSale}
                    onChange={e => setEditingProduct({ ...editingProduct, isOnSale: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded border-zinc-300 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="isOnSaleCheck" className="font-bold text-orange-900 dark:text-orange-200 cursor-pointer flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" /> Highlight as Active Flash Sale Item on Storefront
                  </label>
                </div>

                {editingProduct.isOnSale && editingProduct.salePrice && editingProduct.numericPrice > editingProduct.salePrice && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Customer Discount: Save ${(editingProduct.numericPrice - editingProduct.salePrice).toFixed(2)} ({Math.round(((editingProduct.numericPrice - editingProduct.salePrice) / editingProduct.numericPrice) * 100)}% OFF)
                  </span>
                )}
              </div>
            </div>

            {/* Media & Image Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> 2. Media & Product Asset URL
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Main Image URL / Upload</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.image}
                    onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-orange-500 mb-2"
                  />
                  <div className="flex items-center space-x-3">
                    <label className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                    </label>
                    <span className="text-[11px] text-zinc-400">Supports PNG, JPG, WebP base64 or CDN URL</span>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 relative">
                    <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Variants: Sizes & Colors */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> 3. Shoe Sizes & Color Variants
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sizes List */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Available US Sizes</label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {editingProduct.sizes.map((sz, idx) => (
                      <span key={idx} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        {sz}
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, sizes: editingProduct.sizes.filter((_, i) => i !== idx) })}
                          className="text-zinc-400 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSizeInput}
                      onChange={e => setNewSizeInput(e.target.value)}
                      placeholder="Add size (e.g. 10.5)"
                      className="flex-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSizeInput.trim()) {
                          setEditingProduct({ ...editingProduct, sizes: [...editingProduct.sizes, newSizeInput.trim()] });
                          setNewSizeInput('');
                        }
                      }}
                      className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Colors List */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Colorways</label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {editingProduct.colors.map((c, idx) => (
                      <span key={idx} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        {c}
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, colors: editingProduct.colors.filter((_, i) => i !== idx) })}
                          className="text-zinc-400 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColorInput}
                      onChange={e => setNewColorInput(e.target.value)}
                      placeholder="Add colorway (e.g. Neon Orange)"
                      className="flex-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newColorInput.trim()) {
                          setEditingProduct({ ...editingProduct, colors: [...editingProduct.colors, newColorInput.trim()] });
                          setNewColorInput('');
                        }
                      }}
                      className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> 4. Description & Highlighting Features
              </h4>
              <textarea
                rows={3}
                value={editingProduct.description}
                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                placeholder="Enter detailed description regarding performance, fit, materials, and cushioning technology..."
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-orange-500 mb-4"
              />

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Bullet Point Features</label>
                <div className="space-y-2 mb-3">
                  {editingProduct.features.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs">
                      <span>• {f}</span>
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, features: editingProduct.features.filter((_, i) => i !== idx) })}
                        className="text-zinc-400 hover:text-red-500 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={e => setNewFeatureInput(e.target.value)}
                    placeholder="e.g. Carbon fiber shank plate"
                    className="flex-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeatureInput.trim()) {
                        setEditingProduct({ ...editingProduct, features: [...editingProduct.features, newFeatureInput.trim()] });
                        setNewFeatureInput('');
                      }
                    }}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add Feature
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('catalog')}
                className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Check className="w-4 h-4" /> Save & Publish Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: PRODUCT SCRAPER & RECEIPT SCANNER */}
      {activeSubTab === 'scraper' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center space-x-3">
              <Scan className="w-6 h-6 text-orange-500" />
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Receipt & Web Product Scraper</h3>
                <p className="text-xs text-zinc-500">Scan receipts or input product URLs to parse and populate schema parameters automatically</p>
              </div>
            </div>

            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setScraperMode('receipt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  scraperMode === 'receipt' ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-500'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" /> Receipt Scanner
              </button>
              <button
                onClick={() => setScraperMode('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  scraperMode === 'url' ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-500'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> URL Web Scraper
              </button>
            </div>
          </div>

          {/* Mode 1: Receipt OCR Scanner */}
          {scraperMode === 'receipt' ? (
            <div className="space-y-4">
              <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 text-xs text-orange-600 dark:text-orange-400 flex items-start gap-2">
                <Receipt className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Receipt Scanner & Provenance Recorder:</p>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    Paste supplier invoices, retail receipts, or purchase orders below. The scraper will extract vendor name, prices, line items, size variants, taxes, and unit costs into complete product schema parameters.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Paste Raw Receipt / Invoice Payload *</label>
                <textarea
                  rows={8}
                  value={scrapeReceiptInput}
                  onChange={e => setScrapeReceiptInput(e.target.value)}
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-mono outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setScrapeReceiptInput(SAMPLE_RECEIPT_TEXT)}
                  className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Sample Receipt
                </button>

                <button
                  onClick={handleRunScraper}
                  disabled={isScraping || !scrapeReceiptInput.trim()}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {isScraping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                  <span>{isScraping ? 'Scanning Receipt...' : 'Scan & Extract Product Details'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: E-Commerce URL Scraper */
            <div className="space-y-4">
              <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                <Globe className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">E-Commerce Product Page Web Scraper:</p>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    Enter any external shoe store or marketplace product link. The scraper extracts product images, title, price, size list, and bullet points automatically.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Target Product URL *</label>
                <input
                  type="url"
                  value={scrapeUrlInput}
                  onChange={e => setScrapeUrlInput(e.target.value)}
                  placeholder="e.g. https://nike.com/t/air-max-velocity"
                  className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-medium outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-zinc-400 font-bold self-center">Try Sample Links:</span>
                <button 
                  onClick={() => setScrapeUrlInput('https://nike.com/t/air-max-velocity-runner')}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                >
                  Nike Air Max Velocity
                </button>
                <button 
                  onClick={() => setScrapeUrlInput('https://adidas.com/us/ultraboost-street-carbon')}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                >
                  Adidas UltraBoost Carbon
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunScraper}
                  disabled={isScraping || !scrapeUrlInput.trim()}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {isScraping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  <span>{isScraping ? 'Scraping Web Page...' : 'Scrape Web Page'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isScraping && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-xs font-bold text-orange-500">
                <span>Parsing & Mapping Schema Parameters...</span>
                <span>{scrapeProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${scrapeProgress}%` }} />
              </div>
            </div>
          )}

          {/* Scraped Result Card Preview */}
          {scrapedResult && !isScraping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-3">
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase">
                  <CheckCircle2 className="w-4 h-4" /> 100% Schema Scraped & Populated
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400">ID: {scrapedResult.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <img src={scrapedResult.image} alt={scrapedResult.name} className="w-28 h-28 object-cover rounded-2xl bg-white border border-zinc-200 dark:border-zinc-700 md:col-span-3" />
                
                <div className="md:col-span-9 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-base text-zinc-900 dark:text-white">{scrapedResult.name}</h4>
                    <span className="font-black text-lg text-orange-500">{scrapedResult.price}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{scrapedResult.brand} • {scrapedResult.category} • SKU: {scrapedResult.sku}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">{scrapedResult.description}</p>

                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    <span className="bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold">
                      Sizes: {scrapedResult.sizes.join(', ')}
                    </span>
                    <span className="bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold">
                      Colors: {scrapedResult.colors.join(', ')}
                    </span>
                    <span className="bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold text-emerald-500">
                      Stock: {scrapedResult.stock} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Action options */}
              <div className="pt-3 flex flex-wrap justify-end gap-3 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={handleApplyScrapedToEditor}
                  className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Load into Editor & Customize
                </button>
                <button
                  onClick={handlePublishScrapedDirect}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  <Check className="w-4 h-4" /> Directly Add to Store Catalog
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: PRODUCT UPLOADER (Bulk JSON / CSV / Drag & Drop) */}
      {activeSubTab === 'uploader' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <Upload className="w-6 h-6 text-orange-500" />
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Bulk Product Uploader</h3>
              <p className="text-xs text-zinc-500">Upload batch catalog payloads via JSON or CSV schema format</p>
            </div>
          </div>

          {uploadSuccess && (
            <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> {uploadSuccess}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">JSON Batch Schema Array Input</label>
              <button
                onClick={handleCopySampleTemplate}
                className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> {copiedTemplate ? 'Copied & Pasted!' : 'Load Sample Batch JSON'}
              </button>
            </div>

            <textarea
              rows={8}
              value={jsonUploadInput}
              onChange={e => setJsonUploadInput(e.target.value)}
              placeholder="Paste JSON array containing product objects..."
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-mono outline-none focus:border-orange-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleParseJsonUpload}
                disabled={!jsonUploadInput.trim()}
                className="px-6 py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 cursor-pointer disabled:opacity-50"
              >
                Parse Payload & Preview
              </button>
            </div>
          </div>

          {/* Batch Preview Table */}
          {uploadPreview.length > 0 && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden space-y-4 p-4 bg-zinc-50 dark:bg-zinc-800/40">
              <h4 className="font-bold text-xs uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ready to Import ({uploadPreview.length} Products)
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {uploadPreview.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{item.name}</p>
                        <p className="text-[11px] text-zinc-500">{item.brand} • {item.price}</p>
                      </div>
                    </div>
                    <span className="font-mono text-zinc-400">{item.sku}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCommitBulkUpload}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <Upload className="w-4 h-4" /> Commit Batch Upload to Store Catalog
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
