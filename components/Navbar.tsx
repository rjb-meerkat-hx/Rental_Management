
import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

interface NavbarProps {
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1.5 w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search everything..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-600"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{userName}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white ring-1 ring-indigo-100 transition-all">
             <span className="font-bold text-white text-sm">{userName[0]}</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
};
