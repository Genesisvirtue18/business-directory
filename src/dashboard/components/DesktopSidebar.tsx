import React from 'react';
import { AdminTab, OwnerTab, UserRole } from '../types';

interface DesktopSidebarProps {
  role: UserRole;
  ownerTab: OwnerTab;
  adminTab: AdminTab;
  onSelectOwnerTab: (tab: OwnerTab) => void;
  onSelectAdminTab: (tab: AdminTab) => void;
}

const ownerItems: { tab: OwnerTab; label: string; icon: string }[] = [
  { tab: 'business', label: 'My business', icon: 'storefront' },
  { tab: 'leads', label: 'Leads', icon: 'contact_mail' },
  { tab: 'reviews', label: 'Reviews', icon: 'rate_review' },
  { tab: 'analytics', label: 'Analytics', icon: 'analytics' },
  { tab: 'settings', label: 'Settings', icon: 'settings' },
];

const adminItems: { tab: AdminTab; label: string; icon: string }[] = [
  { tab: 'overview', label: 'Overview', icon: 'dashboard' },
  { tab: 'businesses', label: 'Businesses', icon: 'storefront' },
  { tab: 'leads', label: 'Leads', icon: 'contact_mail' },
  { tab: 'reviews', label: 'Reviews', icon: 'rate_review' },
  { tab: 'more', label: 'Categories', icon: 'category' },
];

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ role, ownerTab, adminTab, onSelectOwnerTab, onSelectAdminTab }) => {
  const items = role === 'owner' ? ownerItems : adminItems;
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#ddd5e6] bg-white p-5 md:flex">
      <div className="flex items-center gap-3 px-2 pb-8">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#5300b7] text-white shadow-lg"><span className="material-symbols-outlined">hub</span></span>
        <div><p className="font-bold text-[#5300b7]">DirectFlow</p><p className="text-xs text-[#7b7486]">{role === 'admin' ? 'Admin workspace' : 'Business workspace'}</p></div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = role === 'owner' ? ownerTab === item.tab : adminTab === item.tab;
          return <button key={item.tab} onClick={() => role === 'owner' ? onSelectOwnerTab(item.tab as OwnerTab) : onSelectAdminTab(item.tab as AdminTab)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${active ? 'bg-[#ebdcff] text-[#260059]' : 'text-[#4a4455] hover:bg-[#f6f2f7]'}`}><span className="material-symbols-outlined text-xl">{item.icon}</span>{item.label}</button>;
        })}
      </nav>
      <div className="mt-auto rounded-xl bg-[#f6f2f7] p-3 text-xs leading-5 text-[#4a4455]">Signed in as<br /><strong className="text-[#1b1b1e]">{role === 'admin' ? 'Administrator' : 'Business owner'}</strong></div>
    </aside>
  );
};
