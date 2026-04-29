
import React from 'react';
import { NAV_ITEMS } from '../constants.tsx';
import { Box, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-100">
          <Box size={24} />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-slate-800">RentFlow</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Plan Usage</p>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">75% of your rental slots used.</p>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
