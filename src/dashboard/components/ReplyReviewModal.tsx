import React, { useState } from 'react';
import { Review } from '../types';

interface ReplyReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReply: (reviewId: string, replyText: string) => void;
}

export const ReplyReviewModal: React.FC<ReplyReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onSubmitReply,
}) => {
  const [replyText, setReplyText] = useState(
    review?.reply || 'Dear patient, thank you so much for your kind words! We take great pride in gentle care and clinic hygiene.'
  );

  if (!isOpen || !review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSubmitReply(review.id, replyText.trim());
    onClose();
  };

  const quickTemplates = [
    'Thank you so much for your kind recommendation! We look forward to seeing you at your next regular checkup.',
    'We truly appreciate your positive feedback on our clinic hygiene and gentle orthodontic care!',
    'Thank you! Our dedicated team works hard to provide pain-free and comfortable dental procedures.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl shadow-2xl border border-[#ccc3d7] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#f0edf1] bg-[#fbf8fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5300b7] text-xl">rate_review</span>
            <h3 className="font-bold text-[16px] text-[#1b1b1e]">Reply to Patient Review</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#7b7486] hover:text-[#1b1b1e]">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Review excerpt */}
          <div className="bg-[#f6f2f7] p-3.5 rounded-xl border border-[#ccc3d7]/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[13px] text-[#1b1b1e]">{review.author}</span>
              <div className="flex text-amber-500 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-xs"
                    style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[13px] italic text-[#4a4455]">"{review.comment}"</p>
          </div>

          {/* Quick reply templates */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#7b7486]">Quick templates:</span>
            <div className="space-y-1">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReplyText(t)}
                  className="block w-full text-left text-[11px] p-2 rounded-lg bg-[#fbf8fc] hover:bg-[#ebdcff]/30 text-[#4a4455] hover:text-[#5300b7] border border-[#ccc3d7]/50 transition-colors"
                >
                  "{t}"
                </button>
              ))}
            </div>
          </div>

          {/* Response textarea */}
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-[#1b1b1e]">Your Official Response:</label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a professional and polite reply..."
              className="w-full text-[13px] p-3 rounded-xl border border-[#ccc3d7] focus:outline-none focus:border-[#5300b7] focus:ring-1 focus:ring-[#5300b7]"
            />
            <p className="text-[10px] text-[#7b7486]">
              Your response will be publicly visible to prospective patients beneath this review on the DirectFlow portal.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0edf1]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#ccc3d7] text-[13px] font-semibold text-[#4a4455] hover:bg-[#f0edf1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2 rounded-lg bg-[#6d28d9] hover:bg-[#5300b7] disabled:opacity-40 text-white text-[13px] font-bold shadow-sm transition-all"
            >
              Post Official Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
