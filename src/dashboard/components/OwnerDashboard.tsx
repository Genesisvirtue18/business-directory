import React from 'react';
import { BusinessListing, Lead, Review } from '../types';

interface OwnerDashboardProps {
  business: BusinessListing;
  leads: Lead[];
  reviews: Review[];
  hasUploadedPhotos: boolean;
  onOpenPublicProfile: () => void;
  onOpenCompleteProfile: () => void;
  onSelectLead: (lead: Lead) => void;
  onOpenReplyReview: (review: Review) => void;
  onViewAllLeads: () => void;
}

const Metric = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <div className="rounded-xl border border-[#ccc3d7] bg-white p-4 shadow-xs">
    <div className="flex items-center justify-between text-[12px] text-[#7b7486]"><span>{label}</span><span className="material-symbols-outlined text-[#5300b7]">{icon}</span></div>
    <p className="mt-2 text-[30px] font-bold leading-none text-[#1b1b1e]">{value}</p>
  </div>
);

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ business, reviews, onOpenPublicProfile, onOpenCompleteProfile }) => {
  const reviewCount = business.reviewsCount || reviews.length;
  return <main className="mx-auto w-full max-w-7xl space-y-5 px-4 pb-24 pt-5 sm:px-6 lg:px-8 md:pb-8">
    <div><span className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${business.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{business.status}</span><h2 className="mt-2 text-[24px] font-bold tracking-tight text-[#1b1b1e]">{business.name}</h2><p className="text-[13px] text-[#4a4455]">{business.category} · {business.location}</p></div>
    <section className="rounded-xl border border-[#ccc3d7] bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-[16px] font-bold">Listing details</h3><p className="mt-1 text-[13px] text-[#4a4455]">{business.description || 'No description has been added yet.'}</p><p className="mt-2 text-[12px] text-[#7b7486]">Phone: {business.phone}</p></div><div className="flex gap-2"><button onClick={onOpenPublicProfile} className="rounded-lg border border-[#ccc3d7] px-3 py-2 text-[13px] font-semibold">View listing</button><button onClick={onOpenCompleteProfile} className="rounded-lg bg-[#5300b7] px-3 py-2 text-[13px] font-semibold text-white">Edit profile</button></div></div></section>
    <section><h3 className="mb-2 text-[16px] font-bold">Listing activity</h3><div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"><Metric label="Profile views" value={business.views || 0} icon="visibility" /><Metric label="Enquiries" value={business.enquiries || 0} icon="mark_email_unread" /><Metric label="Reviews" value={reviewCount} icon="rate_review" /><Metric label="Average rating" value={business.rating?.toFixed(1) || '0.0'} icon="star" /></div></section>
    <section className="rounded-xl border border-[#ccc3d7] bg-white p-4"><h3 className="text-[16px] font-bold">Reviews</h3>{reviews.length ? <div className="mt-3 space-y-3">{reviews.slice(0, 3).map((review) => <div key={review.id} className="border-t border-[#f0edf1] pt-3"><div className="flex justify-between gap-3"><strong className="text-[13px]">{review.author}</strong><span className="text-[12px] text-amber-700">{review.rating}/5</span></div><p className="mt-1 text-[13px] text-[#4a4455]">{review.comment || 'No written comment.'}</p></div>)}</div> : <p className="mt-2 text-[13px] text-[#7b7486]">No reviews have been received yet.</p>}</section>
  </main>;
};
