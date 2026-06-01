
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import { formatINR } from '../utils';
import { RentalOrder, RentalStatus, InvoiceStatus } from '../types';
import { STATUS_COLORS, INVOICE_STATUS_COLORS } from '../constants.tsx';

interface OrdersListProps {
  orders: RentalOrder[];
  onOrderSelect: (id: string) => void;
  onCreateOrder?: () => void;
  onExportOrders?: () => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders, onOrderSelect, onCreateOrder, onExportOrders }) => {
  // Optional handlers passed from parent
  // onCreateOrder: () => void
  // onExportOrders: () => void
  // We'll read them from props via (orders as any).onCreateOrder when used from App
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'ALL') return true;
    return o.status === activeFilter;
  });

  return (
    <div className="flex h-full gap-6">
      {/* Side Filtering Section (Matching wireframe) */}
      <div className="w-56 shrink-0 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rental Status</h3>
          </div>
          <div className="p-2 space-y-1">
            {['ALL', ...Object.values(RentalStatus)].map(status => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                  activeFilter === status 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-normal">
                  {status === 'ALL' ? orders.length : orders.filter(o => o.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice Status</h3>
          </div>
          <div className="p-2 space-y-1">
            {Object.values(InvoiceStatus).map(status => (
              <button
                key={status}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors flex justify-between items-center"
              >
                {status}
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                  {orders.filter(o => o.invoiceStatus === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
             <h2 className="text-2xl font-bold text-slate-800">Rental Orders</h2>
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter by reference or customer..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
             </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onExportOrders && onExportOrders()} className="bg-white border border-slate-200 p-2 rounded-lg text-slate-600 hover:bg-slate-50">
              <FileDown size={20} />
            </button>
            <button onClick={() => onCreateOrder && onCreateOrder()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all">
              <Plus size={18} />
              Create Order
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Reference</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rental Period</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(order => (
                  <tr 
                    key={order.id} 
                    onClick={() => onOrderSelect(order.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-indigo-600">{order.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{order.customerName}</p>
                      <p className="text-xs text-slate-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{order.rentalPeriod.start}</span>
                        <span>→</span>
                        <span className="font-medium text-slate-700">{order.rentalPeriod.end}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-800">{formatINR(order.total)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-sm text-slate-500">
            <p>Showing 1-10 of {orders.length} orders</p>
            <div className="flex gap-2">
              <button className="p-1 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50" disabled>
                <ChevronLeft size={18} />
              </button>
              <button className="p-1 border border-slate-200 rounded hover:bg-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
