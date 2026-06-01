
import React, { useState } from 'react';
import { ArrowLeft, Printer, CheckCircle, XCircle, Send, Package, Truck, Receipt } from 'lucide-react';
import { RentalOrder, RentalStatus } from '../types';
import { STATUS_COLORS } from '../constants.tsx';
import { formatINR } from '../utils';

interface OrderDetailProps {
  order?: RentalOrder;
  onBack: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack }) => {
  const [statusMessage, setStatusMessage] = useState('');

  if (!order) return null;

  const steps = [
    { label: 'Quotation', status: 'done' },
    { label: 'Sent', status: 'done' },
    { label: 'Rental Order', status: order.status !== RentalStatus.QUOTATION ? 'active' : 'pending' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDelivery = () => {
    setStatusMessage('Delivery requested. Your logistics team will follow up with the customer.');
  };

  const handleCreateInvoice = () => {
    setStatusMessage('Invoice generated successfully.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur py-4 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">{order.reference}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-slate-500">Created on {order.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Printer size={16} /> Print
          </button>
          {order.status === RentalStatus.QUOTATION ? (
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
              <CheckCircle size={16} /> Confirm Order
            </button>
          ) : (
             <div className="flex gap-2">
                <button onClick={handleDelivery} className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-50">
                  <Truck size={16} /> Delivery
                </button>
                <button onClick={handleCreateInvoice} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  <Receipt size={16} /> Create Invoice
                </button>
             </div>
          )}
        </div>
      </div>
      {statusMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-800">
          {statusMessage}
        </div>
      )}

      {/* Progress Tracker (Matching wireframe breadcrumbs) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-center gap-8 shadow-sm">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step.status === 'done' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                step.status === 'active' ? 'bg-indigo-600 text-white border border-indigo-700' :
                'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {step.status === 'done' ? <CheckCircle size={14} /> : idx + 1}
              </div>
              <span className={`text-sm font-semibold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && <div className="w-16 h-px bg-slate-200" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</label>
                <p className="font-semibold text-slate-800 text-lg">{order.customerName}</p>
                <p className="text-sm text-slate-500">{order.customerEmail}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rental Period</label>
                <p className="font-semibold text-slate-800">{order.rentalPeriod.start} to {order.rentalPeriod.end}</p>
                <p className="text-xs text-indigo-500 font-medium">5 Days Total</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice Address</label>
                <p className="text-sm text-slate-700 leading-relaxed">
                  123 Business Way, Industrial Park<br />
                  Suite 405, Silicon Valley, CA 94025
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Address</label>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Same as invoice address
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Order Lines</h3>
                <button className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:underline">Add Product</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-l-lg">Product</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right rounded-r-lg">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.productName}</td>
                      <td className="px-4 py-4 text-center">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-slate-500">{formatINR(item.unitPrice)}</td>
                      <td className="px-4 py-4 text-right font-bold text-slate-800">{formatINR(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Totals & Notes */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Untaxed Amount</span>
                <span className="font-semibold text-slate-700">{formatINR(order.untaxedTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Taxes (10%)</span>
                <span className="font-semibold text-slate-700">{formatINR(order.taxTotal)}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-xl font-bold text-indigo-600">{formatINR(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Internal Notes</h3>
            <p className="text-sm text-slate-300 italic">"Customer requested morning delivery between 9 AM and 11 AM. Gate code is 4492."</p>
            <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold uppercase transition-colors">
              Edit Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
