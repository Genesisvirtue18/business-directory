import React from 'react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onSelectRole }) => {
  return (
    <div className="w-full pt-3 sm:pt-4">
      <div className="bg-[#f0edf1] p-1 rounded-xl flex items-center shadow-inner border border-[#ccc3d7]/60">
        <button
          onClick={() => onSelectRole('admin')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            currentRole === 'admin'
              ? 'bg-[#ffffff] text-[#5300b7] shadow-sm font-bold'
              : 'text-[#4a4455] hover:text-[#1b1b1e] hover:bg-white/40'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              currentRole === 'admin' ? 'text-[#5300b7]' : 'text-[#7b7486]'
            }`}
            style={currentRole === 'admin' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            admin_panel_settings
          </span>
          <span>Admin View</span>
        </button>

        <button
          onClick={() => onSelectRole('owner')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            currentRole === 'owner'
              ? 'bg-[#ffffff] text-[#5300b7] shadow-sm font-bold'
              : 'text-[#4a4455] hover:text-[#1b1b1e] hover:bg-white/40'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              currentRole === 'owner' ? 'text-[#5300b7]' : 'text-[#7b7486]'
            }`}
            style={currentRole === 'owner' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            storefront
          </span>
          <span>Business Owner</span>
        </button>
      </div>
    </div>
  );
};
