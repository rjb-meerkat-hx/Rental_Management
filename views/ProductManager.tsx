
import React from 'react';
import { Package, Plus, Search, MoreVertical, Edit3, Trash2, Layers } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants.tsx';

export const ProductManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Product Inventory</h2>
          <p className="text-slate-500">Manage your rentable assets and availability.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-100">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 justify-between bg-slate-50/30">
           <div className="relative flex-1 max-w-sm">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search inventory..." 
               className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/10"
             />
           </div>
           <div className="flex gap-2">
             <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Layers size={20} /></button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Pricing (Day)</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_PRODUCTS.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <img src={product.image} className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-100" />
                       <div>
                         <p className="text-sm font-bold text-slate-800">{product.name}</p>
                         <p className="text-xs text-slate-400">SKU: {product.id.toUpperCase()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                       <div className="flex gap-1 mb-1">
                         {Array.from({length: product.stock}).map((_, i) => (
                           <div key={i} className={`w-1.5 h-3 rounded-sm ${i < product.available ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                         ))}
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{product.available} / {product.stock} Ready</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-slate-800">${product.pricePerDay}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Approx. ${product.pricePerHour}/hr</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 size={16} /></button>
                       <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
