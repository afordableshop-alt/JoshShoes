import React, { useState, useEffect } from 'react';
import { Star, Upload, MessageSquare, ThumbsUp, CheckCircle, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  image?: string;
  likes: number;
}

interface ReviewSectionProps {
  productId: string;
}

const DEFAULT_REVIEWS: Record<string, Review[]> = {
  default: [
    {
      id: 'rev-1',
      author: 'Marcus Vance',
      rating: 5,
      date: 'August 02, 2026',
      title: 'Best cushioning for marathon training',
      comment: 'Unbelievable energy return on long runs. The sole technology feels responsive and lightweight. Fits true to size with plenty of toe room.',
      verified: true,
      likes: 14
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      rating: 5,
      date: 'July 28, 2026',
      title: 'Sleek design & premium materials',
      comment: 'Wore these for both gym workouts and daily street style. Super comfortable upper mesh that breathes well.',
      verified: true,
      likes: 8
    },
    {
      id: 'rev-3',
      author: 'David Chen',
      rating: 4,
      date: 'July 15, 2026',
      title: 'Great fit, high quality build',
      comment: 'Very solid traction on wet pavement. Stiff initial feel for the first 5 miles but broke in wonderfully.',
      verified: true,
      likes: 5
    }
  ]
};

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const storageKey = `josh_reviews_${productId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(DEFAULT_REVIEWS.default);
      }
    } else {
      setReviews(DEFAULT_REVIEWS.default);
    }
  }, [productId]);

  const saveReviews = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem(`josh_reviews_${productId}`, JSON.stringify(updated));
  };

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
    if (rating === 0 || !reviewText.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: authorName.trim() || 'Anonymous Runner',
      rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      title: reviewTitle.trim() || 'Verified Purchase Feedback',
      comment: reviewText.trim(),
      verified: true,
      image: selectedImage || undefined,
      likes: 0
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setIsFormOpen(false);
      setRating(0);
      setAuthorName('');
      setReviewTitle('');
      setReviewText('');
      setSelectedImage(null);
    }, 2500);
  };

  const handleLike = (reviewId: string) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, likes: r.likes + 1 } : r);
    saveReviews(updated);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          <h4 className="text-lg font-black uppercase tracking-tight">Verified Reviews</h4>
          <span className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300">
            {reviews.length}
          </span>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          aria-label={isFormOpen ? 'Close customer review form' : 'Open form to write a customer review'}
          aria-expanded={isFormOpen}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isFormOpen ? 'Close Form' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Ratings Overview Summary */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 mb-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 text-center md:border-r border-zinc-200 dark:border-zinc-700 md:pr-6">
          <p className="text-4xl font-black text-zinc-900 dark:text-white">{averageRating}</p>
          <div className="flex justify-center space-x-1 my-1.5">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? 'fill-orange-500 text-orange-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
            ))}
          </div>
          <p className="text-xs text-zinc-500">Based on {reviews.length} customer ratings</p>
        </div>

        {/* Breakdown Bars */}
        <div className="md:col-span-8 space-y-1.5">
          {ratingCounts.map(item => (
            <div key={item.stars} className="flex items-center space-x-3 text-xs">
              <span className="w-12 font-bold text-zinc-500 flex items-center gap-1">
                {item.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-zinc-400 text-[11px]">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Collapsible Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-zinc-50 dark:bg-zinc-800/80 p-6 rounded-2xl border border-orange-500/30">
              <h5 className="font-bold text-sm uppercase tracking-wider mb-4 text-orange-500">Submit Your Review</h5>

              {submitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 text-emerald-500 p-6 rounded-xl text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold text-sm">Thank you! Your review has been published.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Overall Rating *</label>
                    <div className="flex space-x-1" role="group" aria-label="Rating selector out of 5 stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          aria-label={`Rate ${star} out of 5 stars`}
                          aria-pressed={rating >= star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star className={`w-7 h-7 ${star <= (hoverRating || rating) ? 'fill-orange-500 text-orange-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Your Name</label>
                      <input
                        type="text"
                        aria-label="Your Name"
                        value={authorName}
                        onChange={e => setAuthorName(e.target.value)}
                        placeholder="e.g. Jordan Smith"
                        className="w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Review Headline</label>
                      <input
                        type="text"
                        aria-label="Review Headline"
                        value={reviewTitle}
                        onChange={e => setReviewTitle(e.target.value)}
                        placeholder="e.g. Amazing fit and comfort"
                        className="w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Detailed Review *</label>
                    <textarea 
                      value={reviewText}
                      aria-label="Detailed Review"
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience regarding sizing, arch support, materials, and traction..."
                      rows={3}
                      className="w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-orange-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Upload Photo (Optional)</label>
                    <div className="flex items-center space-x-4">
                      <label aria-label="Upload photo for review" className="cursor-pointer flex items-center justify-center w-14 h-14 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl hover:border-orange-500 transition-colors">
                        <Upload className="w-4 h-4 text-zinc-400" />
                        <input type="file" accept="image/*" className="hidden" aria-label="Choose photo file" onChange={handleImageUpload} />
                      </label>
                      {selectedImage && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 relative">
                          <img src={selectedImage} alt="Uploaded review photo preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    aria-label="Post verified review"
                    disabled={rating === 0 || !reviewText.trim()}
                    className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Post Verified Review
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="p-5 bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-white">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400">{rev.date}</span>
                </div>
              </div>

              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-orange-500 text-orange-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                ))}
              </div>
            </div>

            <h6 className="font-bold text-sm text-zinc-900 dark:text-white">{rev.title}</h6>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>

            {rev.image && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 mt-2">
                <img src={rev.image} alt="Customer review photo" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-200/40 dark:border-zinc-700/40">
              <span>Was this review helpful?</span>
              <button 
                onClick={() => handleLike(rev.id)}
                className="flex items-center space-x-1.5 hover:text-orange-500 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.likes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
