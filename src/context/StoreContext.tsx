import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import heroImage from '../assets/images/futuristic_sneaker_hero_1785206911659.jpg';
import greySneaker from '../assets/images/chunky_grey_sneaker_1785242628354.jpg';
import streetImage from '../assets/images/street_sneaker_1785222603342.jpg';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OrderShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: OrderShippingAddress;
  paymentMethod: string;
}

interface StoreContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: Order[];
  addOrder: (order: Order) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (isOpen: boolean) => void;
  checkoutProduct: CartItem | null;
  setCheckoutProduct: (product: CartItem | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_ORDERS: Order[] = [
  {
    id: 'JOSH-84920',
    date: 'August 08, 2026',
    items: [
      {
        id: 'm2',
        name: 'Quantum Sprint',
        price: '$190',
        numericPrice: 190,
        image: heroImage,
        quantity: 1,
        size: '10',
        color: 'Neon Flare'
      },
      {
        id: 'm3',
        name: 'Graphite Chunky',
        price: '$250',
        numericPrice: 250,
        image: greySneaker,
        quantity: 1,
        size: '10',
        color: 'Graphite Grey'
      }
    ],
    subtotal: 440,
    shipping: 0,
    tax: 36.30,
    discount: 0,
    total: 476.30,
    status: 'In Transit',
    trackingNumber: 'TRK-992014812',
    estimatedDelivery: 'August 14, 2026',
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.m@example.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477'
    },
    paymentMethod: 'Credit Card (•••• 4242)'
  },
  {
    id: 'JOSH-77104',
    date: 'July 24, 2026',
    items: [
      {
        id: 'na4',
        name: 'Street Runner Max',
        price: '$210',
        numericPrice: 210,
        image: streetImage,
        quantity: 1,
        size: '9.5',
        color: 'Street Black'
      }
    ],
    subtotal: 210,
    shipping: 0,
    tax: 17.33,
    discount: 21.00,
    total: 206.33,
    status: 'Delivered',
    trackingNumber: 'TRK-881029381',
    estimatedDelivery: 'July 28, 2026',
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.m@example.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477'
    },
    paymentMethod: 'Apple Pay'
  }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<CartItem | null>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    const savedOrders = localStorage.getItem('josh_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed to parse saved orders');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size && i.color === item.color);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart(prev => prev.filter(i => !(i.id === productId && i.size === size && i.color === color)));
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(i => (i.id === productId && i.size === size && i.color === color) ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      localStorage.setItem('josh_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      wishlist, toggleWishlist,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
      orders, addOrder,
      isDarkMode, toggleDarkMode,
      isCheckoutOpen, setIsCheckoutOpen,
      isOrdersOpen, setIsOrdersOpen,
      checkoutProduct, setCheckoutProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
