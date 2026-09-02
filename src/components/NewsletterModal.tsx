import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Mail, CheckCircle2, Copy, Tag, ArrowRight } from 'lucide-react';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('josh_newsletter_dismissed');
    const isAlreadySub = localStorage.getItem('josh_newsletter_subscribed');

    if (isDismissed || isAlreadySub) return;

    // Timer trigger (6 seconds)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    // Scroll trigger (> 35% page scroll)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 35) {
        setIsOpen(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('josh_newsletter_dismissed', 'true');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsSubscribed(true);
    localStorage.setItem('josh_newsletter_subscribed', 'true');
  };

  const copyPromoCode = () => {
    navigator.clipboard.writeText('JOSHFLASH15');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Seasonal Flash Sale & Newsletter Discount Popup"
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 relative flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Banner Accent */}
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-3 text-white text-center text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>VIP Flash Sale Invitation • 15% OFF</span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close newsletter subscription popup"
            className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 sm:p-10 text-center">
            {!isSubscribed ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block mb-3">
                  Seasonal Member Privilege
                </span>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                  GET 15% OFF YOUR FIRST ORDER
                </h3>

                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed max-w-sm mx-auto">
                  Subscribe to receive early flash sale drops, limited high-top releases, and exclusive member discounts.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      aria-label="Email address for flash sale newsletter"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter and claim discount"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Claim 15% Discount</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <button
                  onClick={handleClose}
                  aria-label="Dismiss newsletter popup"
                  className="mt-4 text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline cursor-pointer"
                >
                  No thanks, I prefer paying full price
                </button>
              </>
            ) : (
              <div className="py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Welcome To The Club!
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                  Your 15% discount promo code is ready to use immediately at checkout:
                </p>

                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-dashed border-orange-500 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-orange-500" />
                    <span className="font-mono text-base font-black tracking-wider text-orange-500">
                      JOSHFLASH15
                    </span>
                  </div>

                  <button
                    onClick={copyPromoCode}
                    aria-label="Copy discount promo code JOSHFLASH15"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={handleClose}
                  aria-label="Start shopping with discount"
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all cursor-pointer mt-4"
                >
                  Start Shopping Now
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
