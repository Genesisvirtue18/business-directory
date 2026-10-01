import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  role: UserRole;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenProfileMenu?: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenProfileMenu,
  onOpenMobileMenu,
}) => {
  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 h-16 sticky top-0 z-40 bg-[#ffffff] shadow-sm border-b border-[#e4e1e6]">
      <div className="flex items-center gap-2 sm:gap-3">
        {role === 'admin' && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open Navigation"
            className="p-1.5 rounded-lg hover:bg-[#f6f2f7] transition-colors duration-150 active:scale-95 text-[#5300b7] md:hidden"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        )}

        {role === 'owner' ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5300b7] flex items-center justify-center text-white font-bold shadow-sm">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                hub
              </span>
            </div>
            <div>
              <h1 className="text-[17px] sm:text-[18px] font-bold text-[#5300b7] tracking-tight font-headline-sm">
                DirectFlow
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#5300b7] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
            <span className="text-[17px] sm:text-[18px] font-bold text-[#5300b7] tracking-tight font-headline-sm">
              DirectFlow
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onOpenSearch}
          aria-label="Search listings"
          className="p-2 rounded-lg text-[#4a4455] hover:bg-[#f6f2f7] transition-colors duration-150 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-[#4a4455] hover:bg-[#f6f2f7] transition-colors duration-150 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#5300b7] text-white font-bold text-[10px] ring-2 ring-white">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        <div className="flex items-center ml-1 pl-2 border-l border-[#ccc3d7]">
          {role === 'owner' ? (
            <button
              onClick={onOpenProfileMenu}
              className="relative cursor-pointer focus:outline-none"
              title="Business owner profile"
            >
              <div className="w-8 h-8 rounded-full ring-2 ring-[#ebdcff] flex items-center justify-center bg-[#f0edf1] text-[13px] font-bold text-[#5300b7]">
                BO
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#5300b7] text-white text-[9px] font-bold px-1 rounded-full border border-white">
                Pro
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenProfileMenu}
              className="relative cursor-pointer focus:outline-none"
              title="Administrator profile"
            >
              <div className="relative w-8 h-8 rounded-full bg-[#ebdcff] flex items-center justify-center text-[#5300b7] font-bold overflow-hidden shadow-xs ring-1 ring-[#ccc3d7]">
                AD
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
