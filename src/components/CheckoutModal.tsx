import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Mock processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setStep(1);
          setIsSuccess(false);
        }, 500);
      }, 2000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] text-zinc-900 dark:text-zinc-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800">
              <h3 className="text-xl font-black tracking-tight uppercase">
                {isSuccess ? 'Order Confirmed' : 'Secure Checkout'}
              </h3>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-10 overflow-y-auto">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShieldCheck className="w-20 h-20 text-emerald-500 mb-6" />
                  <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">Payment Successful</h4>
                  <p className="text-zinc-500 dark:text-zinc-400">Thank you for your purchase. A receipt has been sent to your email.</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Order Summary */}
                  <div className="w-full md:w-1/3 flex flex-col space-y-4">
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div>
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{product.category}</p>
                      <p className="font-black mt-2">{product.price}</p>
                    </div>
                  </div>
                  
                  {/* Form */}
                  <div className="w-full md:w-2/3">
                    <div className="flex space-x-2 mb-8">
                      <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                    </div>
                    
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Shipping Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="First Name" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                          <input type="text" placeholder="Last Name" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                        </div>
                        <input type="text" placeholder="Address" className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="City" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                          <input type="text" placeholder="Postal Code" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                        </div>
                        <button onClick={handleNext} className="w-full mt-4 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-colors">
                          Continue to Payment
                        </button>
                      </motion.div>
                    )}
                    
                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Payment Details</h4>
                        <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center space-x-3 mb-4">
                          <CreditCard className="w-5 h-5 text-zinc-500" />
                          <span className="font-medium text-sm">Credit Card</span>
                        </div>
                        <input type="text" placeholder="Card Number" className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="MM/YY" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                          <input type="text" placeholder="CVC" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-orange-500" />
                        </div>
                        <div className="flex space-x-4 mt-6">
                          <button onClick={handlePrev} className="px-6 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                            Back
                          </button>
                          <button 
                            onClick={handleCheckout} 
                            disabled={isProcessing}
                            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors disabled:opacity-70 flex justify-center items-center"
                          >
                            {isProcessing ? 'Processing...' : `Pay ${product.price}`}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
