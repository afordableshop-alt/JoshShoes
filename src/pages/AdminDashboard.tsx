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
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const STATS = [
  { label: 'Total Revenue', value: '$124,563.00', increase: '+14.5%' },
  { label: 'Total Orders', value: '1,429', increase: '+8.2%' },
  { label: 'Active Users', value: '842', increase: '+2.4%' },
  { label: 'Conversion Rate', value: '3.6%', increase: '+1.1%' },
];

const INITIAL_ORDERS = [
  { id: '#ORD-7352', customer: 'Sarah Jenkins', product: 'Quantum Velocity - Neon Flare', date: 'Oct 24, 2023', amount: '$240.00', status: 'Delivered' },
  { id: '#ORD-7351', customer: 'Michael Chen', product: 'Quantum Velocity - Stealth', date: 'Oct 24, 2023', amount: '$240.00', status: 'Processing' },
  { id: '#ORD-7350', customer: 'Emma Thompson', product: 'Quantum Velocity - Arctic', date: 'Oct 23, 2023', amount: '$240.00', status: 'Delivered' },
  { id: '#ORD-7349', customer: 'David Rodriguez', product: 'Quantum Velocity - Neon Flare', date: 'Oct 23, 2023', amount: '$240.00', status: 'Shipped' },
  { id: '#ORD-7348', customer: 'Alex Kim', product: 'Quantum Velocity - Stealth', date: 'Oct 22, 2023', amount: '$240.00', status: 'Delivered' },
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
  { id: 'INV-1', product: 'Quantum Velocity - Neon Flare (Size 9)', stock: 12, alertSent: false },
  { id: 'INV-2', product: 'JoshShoes Lifestyle (M) - White (Size 10)', stock: 4, alertSent: false },
  { id: 'INV-3', product: 'Street Runner Max - Grey (Size 8.5)', stock: 2, alertSent: true },
  { id: 'INV-4', product: 'Velocity Stealth Edition - Black (Size 7)', stock: 8, alertSent: false },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Package, label: 'Products', active: false },
  { icon: ShoppingCart, label: 'Orders', active: false },
  { icon: Users, label: 'Customers', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function AdminDashboard() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const triggerAlert = (id: string) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, alertSent: true } : item));
    // In a real app, this would trigger an API call to send an email
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900 selection:bg-orange-500 selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-950 text-zinc-400 fixed h-full z-20">
        <div className="h-20 flex items-center px-8 border-b border-zinc-900">
          <a href="/" className="text-2xl font-black tracking-tighter uppercase text-white">
            JoshShoes<span className="text-orange-500">.</span>
          </a>
        </div>
        
        <div className="flex-1 py-8 px-4 flex flex-col space-y-2">
          <p className="px-4 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">Overview</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                  item.active 
                    ? 'bg-orange-500/10 text-orange-500' 
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
              <p className="text-xs text-zinc-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-64 w-full relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 text-zinc-900"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-zinc-100 border-transparent rounded-full text-sm focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none w-64 transition-all"
              />
            </div>
            <button className="relative p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 bg-orange-500 text-white text-[8px] font-bold h-3 w-3 rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
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
                  <h3 className="text-lg font-bold tracking-tight">Low Stock Alerts</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Product</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Current Stock</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-zinc-900">{item.product}</td>
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
                              className="bg-zinc-900 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded-lg transition-colors"
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
                <h3 className="text-lg font-bold tracking-tight">Recent Orders</h3>
                <button className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
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
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {orders.map((order, i) => (
                      <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-zinc-900 whitespace-nowrap">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-zinc-600 whitespace-nowrap">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap hidden md:table-cell">{order.product}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap hidden sm:table-cell">{order.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-900 whitespace-nowrap">{order.amount}</td>
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
                <p className="px-4 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">Overview</p>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                        item.active 
                          ? 'bg-orange-500/10 text-orange-500' 
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
