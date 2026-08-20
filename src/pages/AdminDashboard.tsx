import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Search,
  Bell,
  MoreVertical,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  AlertTriangle,
  ArrowLeft,
  Flame,
  Tag,
  TrendingDown,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ProductManagerTab from '../components/ProductManagerTab';

import { Globe } from 'lucide-react';
import SEOHubTab from '../components/SEOHubTab';

const STATS = [
  { label: 'Total Revenue', value: '$124,563.00', increase: '+14.5%', isSale: false },
  { label: 'Active Sale Savings', value: '$21,840.00', increase: '+24.2% Promo Sales', isSale: true },
  { label: 'Total Orders', value: '1,429', increase: '+8.2%', isSale: false },
  { label: 'Active Users', value: '842', increase: '+2.4%', isSale: false },
  { label: 'Flash Sale Conversion', value: '4.8%', increase: '+1.9%', isSale: true },
];

const INITIAL_ORDERS = [
  { id: '#ORD-7352', customer: 'Sarah Jenkins', product: 'Quantum Velocity Plus', date: 'Oct 24, 2023', amount: '$219.99', originalAmount: '$260.00', isOnSale: true, status: 'Delivered' },
  { id: '#ORD-7351', customer: 'Michael Chen', product: 'CloudStride Pink', date: 'Oct 24, 2023', amount: '$189.99', originalAmount: '$220.00', isOnSale: true, status: 'Processing' },
  { id: '#ORD-7350', customer: 'Emma Thompson', product: 'Urban High-Top Streetwear', date: 'Oct 23, 2023', amount: '$199.99', originalAmount: '$240.00', isOnSale: true, status: 'Delivered' },
  { id: '#ORD-7349', customer: 'David Rodriguez', product: 'Quantum Velocity - Neon Flare', date: 'Oct 23, 2023', amount: '$240.00', isOnSale: false, status: 'Shipped' },
  { id: '#ORD-7348', customer: 'Alex Kim', product: 'Quantum Velocity - Stealth', date: 'Oct 22, 2023', amount: '$240.00', isOnSale: false, status: 'Delivered' },
];

const MONTHLY_REVENUE = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 7500 },
  { name: 'Jul', revenue: 8200 },
  { name: 'Aug', revenue: 7000 },
  { name: 'Sep', revenue: 9000 },
  { name: 'Oct', revenue: 10500 },
];

const TOP_CATEGORIES = [
  { name: 'Men Running', sales: 400 },
  { name: 'Women Casual', sales: 300 },
  { name: 'Streetwear', sales: 350 },
  { name: 'Collections', sales: 250 },
];

const INITIAL_INVENTORY = [
  { id: 'INV-1', product: 'Quantum Velocity - Neon Flare (Size 9)', regPrice: 260, salePrice: 219.99, stock: 12, alertSent: false },
  { id: 'INV-2', product: 'JoshShoes Lifestyle (M) - White (Size 10)', regPrice: 180, salePrice: 149.99, stock: 4, alertSent: false },
  { id: 'INV-3', product: 'Street Runner Max - Grey (Size 8.5)', regPrice: 210, salePrice: 179.99, stock: 2, alertSent: true },
  { id: 'INV-4', product: 'Velocity Stealth Edition - Black (Size 7)', regPrice: 250, salePrice: 199.99, stock: 8, alertSent: false },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Package, label: 'Products', active: false },
  { icon: ShoppingCart, label: 'Orders', active: false },
  { icon: Users, label: 'Customers', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function AdminDashboard() {
  const [activeNavTab, setActiveNavTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Customers' | 'SEO & AI Search' | 'Settings'>('Dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const triggerAlert = (id: string) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, alertSent: true } : item));
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'Dashboard' as const },
    { icon: Package, label: 'Products', id: 'Products' as const },
    { icon: ShoppingCart, label: 'Orders', id: 'Orders' as const },
    { icon: Users, label: 'Customers', id: 'Customers' as const },
    { icon: Globe, label: 'SEO & AI Search', id: 'SEO & AI Search' as const },
    { icon: Settings, label: 'Settings', id: 'Settings' as const },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900 selection:bg-orange-500 selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-950 text-zinc-400 fixed h-full z-20">
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-900">
          <a href="/" className="text-2xl font-black tracking-tighter uppercase text-white flex items-center gap-1">
            JoshShoes<span className="text-orange-500">.</span>
          </a>
          <a href="/" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Store
          </a>
        </div>
        
        <div className="flex-1 py-8 px-4 flex flex-col space-y-2">
          <p className="px-4 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNavTab(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full cursor-pointer ${
                  isActive 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-zinc-900">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer text-white">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs uppercase text-white">
              JD
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-zinc-500">Admin Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-64 w-full relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden text-zinc-900"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {activeNavTab === 'Dashboard' && 'Admin Dashboard Overview'}
                {activeNavTab === 'Products' && 'Product Management & Scraper Suite'}
                {activeNavTab === 'Orders' && 'Customer Orders Management'}
                {activeNavTab === 'Customers' && 'Customer CRM'}
                {activeNavTab === 'Settings' && 'Store Configuration Settings'}
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">
                {activeNavTab === 'Products' ? 'Scrape receipts, edit product parameters, and upload batch catalogs' : 'Real-time store metrics, inventory alerts, and order processing'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search metrics or products..." 
                className="pl-10 pr-4 py-2 bg-zinc-100 border-transparent rounded-full text-xs font-medium focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none w-64 transition-all"
              />
            </div>
            <a
              href="/"
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors hidden sm:flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back To Storefront
            </a>
          </div>
        </header>

        {/* Dynamic Content View */}
        <div className="p-6 lg:p-10 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* RENDER PRODUCTS TAB */}
            {activeNavTab === 'Products' && <ProductManagerTab />}

            {/* RENDER DASHBOARD OVERVIEW */}
            {activeNavTab === 'Dashboard' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {STATS.map((stat, i) => (
                    <div 
                      key={i} 
                      className={`p-5 rounded-2xl border shadow-sm transition-all ${
                        stat.isSale 
                          ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800' 
                          : 'bg-white border-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                        {stat.isSale && (
                          <span className="bg-orange-500 text-white p-1 rounded-full animate-bounce">
                            <Flame className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-end justify-between gap-1">
                        <p className={`text-xl font-black tracking-tighter ${stat.isSale ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-900'}`}>
                          {stat.value}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shrink-0 ${
                          stat.isSale ? 'bg-orange-500/10 text-orange-600 font-black' : 'text-emerald-600 bg-emerald-50'
                        }`}>
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                          {stat.increase}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold tracking-tight mb-6">Monthly Revenue</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MONTHLY_REVENUE}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dx={-10} tickFormatter={(value) => `$${value}`} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`$${value}`, 'Revenue']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold tracking-tight mb-6">Top Categories</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={TOP_CATEGORIES} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f4f4f5' }}
                          />
                          <Bar dataKey="sales" fill="#18181b" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Inventory Alerts Table */}
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-red-50/50">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      <h3 className="text-lg font-bold tracking-tight">Low Stock & Sale Pricing Alerts</h3>
                    </div>
                    <button 
                      onClick={() => setActiveNavTab('Products')}
                      className="text-xs font-bold uppercase tracking-wider text-orange-500 hover:underline cursor-pointer"
                    >
                      Manage Products & Stock →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/50">
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Product</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Reg Price</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Sale Price</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Current Stock</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Status</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {inventory.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-zinc-900">{item.product}</td>
                            <td className="px-6 py-4 text-sm font-bold text-zinc-400 line-through">${item.regPrice.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-black text-red-600 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 text-orange-500" />
                                ${item.salePrice.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-sm font-bold ${item.stock < 5 ? 'text-red-500' : 'text-zinc-900'}`}>
                                {item.stock} units
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.stock < 5 ? (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600">
                                  Critical Low
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-600">
                                  Warning
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              {item.alertSent ? (
                                <span className="text-xs font-bold text-emerald-500 flex items-center justify-end uppercase tracking-widest">
                                  Alert Sent
                                </span>
                              ) : (
                                <button 
                                  onClick={() => triggerAlert(item.id)}
                                  className="bg-zinc-900 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                  Send Alert
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold tracking-tight">Recent Store Orders</h3>
                    <button onClick={() => setActiveNavTab('Orders')} className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/50">
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Order ID</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Customer</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 hidden md:table-cell">Product</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 hidden sm:table-cell">Date</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Paid Amount (Sale)</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Status</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-zinc-900 whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4 text-sm text-zinc-600 whitespace-nowrap">{order.customer}</td>
                            <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap hidden md:table-cell">{order.product}</td>
                            <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap hidden sm:table-cell">{order.date}</td>
                            <td className="px-6 py-4 text-sm font-medium text-zinc-900 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-zinc-900">{order.amount}</span>
                                {order.isOnSale && order.originalAmount && (
                                  <span className="text-[10px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                    <Flame className="w-2.5 h-2.5" /> Promo
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap relative">
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className={`appearance-none outline-none cursor-pointer px-3 py-1 pr-8 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                  order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' :
                                  order.status === 'Processing' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' :
                                  'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <ChevronDown className={`w-3 h-3 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none ${
                                  order.status === 'Delivered' ? 'text-emerald-600' :
                                  order.status === 'Processing' ? 'text-amber-600' :
                                  'text-blue-600'
                                }`} />
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* RENDER SEO & AI SEARCH TAB */}
            {activeNavTab === 'SEO & AI Search' && (
              <SEOHubTab />
            )}

            {/* RENDER OTHER TABS PLACEHOLDERS */}
            {(activeNavTab === 'Orders' || activeNavTab === 'Customers' || activeNavTab === 'Settings') && (
              <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center space-y-3">
                <Package className="w-12 h-12 mx-auto text-orange-500 opacity-60" />
                <h3 className="font-bold text-lg">{activeNavTab} Management Active</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  System module for {activeNavTab.toLowerCase()} is synchronized and active. Access storefront orders, customer profiles, and store settings here.
                </p>
                <button
                  onClick={() => setActiveNavTab('Products')}
                  className="mt-4 px-6 py-2.5 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Switch to Product Scraper & Manager
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm md:hidden flex"
          >
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-64 bg-zinc-950 h-full flex flex-col shadow-2xl"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-900 text-white">
                <a href="/" className="text-2xl font-black tracking-tighter uppercase">
                  JoshShoes<span className="text-orange-500">.</span>
                </a>
                <button onClick={() => setIsMobileNavOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 py-8 px-4 flex flex-col space-y-2 text-zinc-400">
                <p className="px-4 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">Navigation</p>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavTab === item.id;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveNavTab(item.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                        isActive 
                          ? 'bg-orange-500/10 text-orange-500 font-bold' 
                          : 'hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
            <div className="flex-1" onClick={() => setIsMobileNavOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
