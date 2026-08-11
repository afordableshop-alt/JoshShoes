import React, { useState } from 'react';
import { Star, Upload, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setReviewText('');
      setSelectedImage(null);
    }, 3000);
  };

  return (
    <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-5 h-5 text-orange-500" />
        <h4 className="text-lg font-black uppercase tracking-tight">Customer Reviews</h4>
      </div>

      {submitted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl text-center">
          <p className="font-bold">Thank you for your review!</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Rating</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'fill-orange-500 text-orange-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Review</p>
            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you think about this product?"
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-orange-500 min-h-[100px] resize-none"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Add Photo</p>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer flex items-center justify-center w-16 h-16 bg-zinc-50 dark:bg-zinc-800 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl hover:border-orange-500 transition-colors">
                <Upload className="w-5 h-5 text-zinc-400" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {selectedImage && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={rating === 0}
            className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}
