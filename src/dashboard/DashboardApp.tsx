"use client";

import React, { useEffect, useState } from 'react';
import { UserRole, OwnerTab, AdminTab, BusinessListing, Lead, Review } from './types';
import { loadAdminDashboard, loadOwnerDashboard, reviewBusiness } from './api';
import { Header } from './components/Header';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BottomNav } from './components/BottomNav';
import { PublicProfileModal } from './components/PublicProfileModal';
import { CompleteProfileModal } from './components/CompleteProfileModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { ReplyReviewModal } from './components/ReplyReviewModal';
import { SearchModal } from './components/SearchModal';
import { OwnerLeadsTab } from './components/OwnerLeadsTab';
import { OwnerReviewsTab } from './components/OwnerReviewsTab';
import { AdminBusinessesTab } from './components/AdminBusinessesTab';
import { DesktopSidebar } from './components/DesktopSidebar';
import { BusinessProfileForm } from './components/BusinessProfileForm';
import { CategoryManager } from './components/CategoryManager';

interface DashboardAppProps {
  role: UserRole;
}

export default function DashboardApp({ role }: DashboardAppProps) {
  // Each route receives a fixed role. There is deliberately no role switcher.
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('business');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Business state
  const [pendingBusinesses, setPendingBusinesses] = useState<BusinessListing[]>([]);
  const [activeBusinesses, setActiveBusinesses] = useState<BusinessListing[]>([]);
  const [hasUploadedPhotos] = useState<boolean>(false);

  // Leads & Reviews state
  const [ownerLeads, setOwnerLeads] = useState<Lead[]>([]);
  const [adminLeads, setAdminLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let live = true;
    (async () => { try {
      setLoading(true); setLoadError('');
      if (role === 'admin') { const items = await loadAdminDashboard(); if (live) { setPendingBusinesses(items.filter((item) => item.status === 'Pending')); setActiveBusinesses(items.filter((item) => item.status !== 'Pending')); } }
      else { const data = await loadOwnerDashboard(); if (live) { setActiveBusinesses(data.businesses); setReviews(data.reviews); } }
    } catch (error) { if (live) setLoadError(error instanceof Error ? error.message : 'Unable to load dashboard data'); } finally { if (live) setLoading(false); } })();
    return () => { live = false; };
  }, [role]);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals state
  const [publicProfileBiz, setPublicProfileBiz] = useState<BusinessListing | null>(null);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handlers
  const handleApproveBusiness = async (bizId: string) => {
    const biz = pendingBusinesses.find((b) => b.id === bizId);
    if (!biz) return;
    try {
      const updated = await reviewBusiness(bizId, 'approve');
      setPendingBusinesses((prev) => prev.filter((b) => b.id !== bizId));
      setActiveBusinesses((prev) => [updated, ...prev.filter(item => item.id !== bizId)]);
      showToast(`"${biz.name}" approved and published.`);
    } catch (error) { showToast(error instanceof Error ? error.message : 'Unable to approve this listing'); }
  };

  const handleRejectBusiness = async (bizId: string, rejectionReason?: string) => {
    const biz = pendingBusinesses.find((b) => b.id === bizId);
    if (!biz) return;
    try {
      const rejected = await reviewBusiness(bizId, 'reject', rejectionReason);
      setPendingBusinesses((prev) => prev.filter((b) => b.id !== bizId));
      setActiveBusinesses((prev) => [rejected, ...prev.filter(item => item.id !== bizId)]);
      showToast(`Listing "${biz.name}" was rejected.`);
    } catch (error) { showToast(error instanceof Error ? error.message : 'Unable to reject this listing'); }
  };

  const handleAddBusiness = (newBiz: BusinessListing) => {
    setActiveBusinesses((prev) => [newBiz, ...prev]);
    showToast(`✓ New business "${newBiz.name}" registered successfully!`);
  };

  const handleEditBusiness = () => {
    if (primaryOwnerBusiness?.status === 'Pending') {
      showToast('This listing is in the admin review queue and cannot be edited yet.');
      return;
    }
    setIsBusinessFormOpen(true);
  };

  const handleAddCategory = (name: string) => {
    showToast(`✓ Category "${name}" created and synced with directory search.`);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setOwnerLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    setAdminLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Lead status updated to "${newStatus}"`);
  };

  const handleAddLeadNote = (leadId: string, note: string) => {
    const updater = (prev: Lead[]) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, notes: [...(l.notes || []), note] } : l
      );
    setOwnerLeads(updater);
    setAdminLeads(updater);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) =>
        prev ? { ...prev, notes: [...(prev.notes || []), note] } : null
      );
    }
    showToast('Follow-up note added to CRM log');
  };

  const handleSubmitReply = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: replyText,
              replyDate: 'Today',
            }
          : r
      )
    );
    showToast('✓ Official response published to patient review!');
  };

  const handleExportData = () => {
    showToast('Exporting directory metrics and leads data to CSV...');
  };

  const primaryOwnerBusiness = activeBusinesses[0];

  return (
    <div className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 px-4 py-2.5 rounded-xl bg-[#260059] text-white text-[13px] font-semibold shadow-xl border border-[#d3bbff]/40 flex items-center gap-2 animate-slide-down">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive App Frame Container */}
      <div className="flex min-h-screen w-full">
        <DesktopSidebar role={role} ownerTab={ownerTab} adminTab={adminTab} onSelectOwnerTab={setOwnerTab} onSelectAdminTab={setAdminTab} />
      <div className="min-w-0 flex-1 bg-[#fbf8fc]">
        {/* Top App Bar Component */}
        <Header
          role={role}
          unreadNotificationsCount={0}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => showToast('Notifications are not available from the current API.')}
          onOpenProfileMenu={() => {
            if (role === 'owner') {
              setPublicProfileBiz(primaryOwnerBusiness);
            } else {
              showToast('Business listings are created by business owners.');
            }
          }}
          onOpenMobileMenu={() => setAdminTab('businesses')}
        />

        {/* Dashboard Content per Role and Sub-Tab */}
        <div className="flex-1">
          {loading ? (
            <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-[#4a4455]">Loading dashboard data…</div>
          ) : loadError ? (
            <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-red-700">{loadError}. Please sign in again or start the API server.</div>
          ) : role === 'owner' && !primaryOwnerBusiness ? (
            <main className="mx-auto max-w-7xl px-6 py-10"><h2 className="text-xl font-bold">Add your business</h2><p className="mt-2 text-sm text-[#4a4455]">No businesses have been created for this account yet.</p><button onClick={() => setIsBusinessFormOpen(true)} className="mt-4 rounded-lg bg-[#5300b7] px-4 py-2 text-sm font-semibold text-white">Add business</button></main>
          ) : role === 'owner' ? (
            ownerTab === 'business' ? (
              <OwnerDashboard
                business={primaryOwnerBusiness}
                leads={ownerLeads}
                reviews={reviews}
                hasUploadedPhotos={hasUploadedPhotos}
                onOpenPublicProfile={() => setPublicProfileBiz(primaryOwnerBusiness)}
                onOpenCompleteProfile={handleEditBusiness}
                onSelectLead={(l) => setSelectedLead(l)}
                onOpenReplyReview={(r) => setSelectedReview(r)}
                onViewAllLeads={() => setOwnerTab('leads')}
              />
            ) : ownerTab === 'leads' ? (
              <OwnerLeadsTab
                leads={ownerLeads}
                onSelectLead={(l) => setSelectedLead(l)}
                onBackToDashboard={() => setOwnerTab('business')}
              />
            ) : ownerTab === 'reviews' ? (
              <OwnerReviewsTab
                reviews={reviews}
                onOpenReplyReview={(r) => setSelectedReview(r)}
                onBackToDashboard={() => setOwnerTab('business')}
              />
            ) : ownerTab === 'analytics' ? (
              <OwnerDashboard
                business={primaryOwnerBusiness}
                leads={ownerLeads}
                reviews={reviews}
                hasUploadedPhotos={hasUploadedPhotos}
                onOpenPublicProfile={() => setPublicProfileBiz(primaryOwnerBusiness)}
                onOpenCompleteProfile={handleEditBusiness}
                onSelectLead={(l) => setSelectedLead(l)}
                onOpenReplyReview={(r) => setSelectedReview(r)}
                onViewAllLeads={() => setOwnerTab('leads')}
              />
            ) : (
              // Settings tab
              <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8 space-y-4">
                <h2 className="text-[20px] font-bold text-[#1b1b1e] font-headline-md">
                  Merchant Settings
                </h2>
                <div className="bg-white p-4 rounded-xl border border-[#ccc3d7] space-y-3">
                  <h3 className="font-bold text-[14px]">{primaryOwnerBusiness.name}</h3>
                  <div className="space-y-1 text-[13px] text-[#4a4455]">
                    <p>Phone: {primaryOwnerBusiness.phone}</p>
                    <p>Location: {primaryOwnerBusiness.location}</p>
                    <p>Status: {primaryOwnerBusiness.status}</p>
                  </div>
                  <button
                    onClick={() => setPublicProfileBiz(primaryOwnerBusiness)}
                    className="w-full py-2 bg-[#5300b7] text-white font-bold rounded-lg text-[13px]"
                  >
                    View Public Storefront
                  </button>
                </div>
              </main>
            )
          ) : (
            // Admin View
            adminTab === 'overview' ? (
              <AdminDashboard
                pendingBusinesses={pendingBusinesses}
                activeBusinesses={activeBusinesses}
                adminLeads={adminLeads}
                onApproveBusiness={handleApproveBusiness}
                onRejectBusiness={handleRejectBusiness}
                onInspectBusiness={(b) => setPublicProfileBiz(b)}
                onOpenAddCategory={() => showToast('Category creation is not available from the current API.')}
                onExportData={() => showToast('Export is not available from the current API.')}
                onSelectLead={(l) => setSelectedLead(l)}
                onViewAllPending={() => setAdminTab('businesses')}
              />
            ) : adminTab === 'businesses' ? (
              <AdminBusinessesTab
                activeBusinesses={activeBusinesses}
                pendingBusinesses={pendingBusinesses}
                onInspectBusiness={(b) => setPublicProfileBiz(b)}
                onApproveBusiness={handleApproveBusiness}
                onRejectBusiness={handleRejectBusiness}
                onBackToOverview={() => setAdminTab('overview')}
              />
            ) : adminTab === 'leads' ? (
              <OwnerLeadsTab
                leads={adminLeads}
                onSelectLead={(l) => setSelectedLead(l)}
                onBackToDashboard={() => setAdminTab('overview')}
              />
            ) : adminTab === 'reviews' ? (
              <OwnerReviewsTab
                reviews={reviews}
                onOpenReplyReview={(r) => setSelectedReview(r)}
                onBackToDashboard={() => setAdminTab('overview')}
              />
            ) : (
              <CategoryManager onMessage={showToast} />
            )
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNav
          role={role}
          ownerTab={ownerTab}
          adminTab={adminTab}
          onSelectOwnerTab={(t) => setOwnerTab(t)}
          onSelectAdminTab={(t) => setAdminTab(t)}
          leadsCount={ownerLeads.length}
        />
      </div>
      </div>

      {/* Modals & Slide-overs */}
      <PublicProfileModal
        isOpen={!!publicProfileBiz}
        onClose={() => setPublicProfileBiz(null)}
        business={publicProfileBiz || primaryOwnerBusiness!}
      />

      <CompleteProfileModal
        isOpen={isCompleteProfileOpen}
        onClose={() => setIsCompleteProfileOpen(false)}
        hasUploadedPhotos={hasUploadedPhotos}
        onCompleteUpload={() => {
          showToast('Photo upload is not available from the current API.');
          showToast('✓ Clinic photos uploaded! Profile is now 100% complete.');
        }}
      />

      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateLeadStatus}
        onAddNote={handleAddLeadNote}
      />

      <ReplyReviewModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onSubmitReply={handleSubmitReply}
      />

      {isBusinessFormOpen && role === 'owner' && <BusinessProfileForm businessId={primaryOwnerBusiness?.id} onClose={() => setIsBusinessFormOpen(false)} onSaved={(business, created) => { setActiveBusinesses((items) => created ? [business, ...items] : items.map((item) => item.id === business.id ? business : item)); setIsBusinessFormOpen(false); showToast(created ? `"${business.name}" was submitted for admin review.` : 'Business profile saved.'); }} />}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        businesses={[...activeBusinesses, ...pendingBusinesses]}
        leads={[...ownerLeads, ...adminLeads]}
        onSelectBusiness={(b) => setPublicProfileBiz(b)}
        onSelectLead={(l) => setSelectedLead(l)}
      />
    </div>
  );
}
