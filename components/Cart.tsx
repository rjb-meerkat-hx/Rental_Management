import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants.tsx';

interface CartItem {
  id: string;
  product: typeof MOCK_PRODUCTS[0];
  quantity: number;
  rentalDays: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateDays: (id: string, days: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onUpdateDays, 
  onRemoveItem, 
  onCheckout 
}) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.product.pricePerDay * item.quantity * item.rentalDays);
    }, 0);
  };

  const calculateSubtotal = (item: CartItem) => {
    return item.product.pricePerDay * item.quantity * item.rentalDays;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm font-semibold">
              {items.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.category}</p>
                      <p className="text-sm font-medium text-indigo-600 mt-1">
                        ₹{item.product.pricePerDay}/day
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.min(item.product.available, item.quantity + 1))}
                          className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rental Days:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateDays(item.id, Math.max(1, item.rentalDays - 1))}
                          className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.rentalDays}</span>
                        <button
                          onClick={() => onUpdateDays(item.id, item.rentalDays + 1)}
                          className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-gray-900">
                          ₹{calculateSubtotal(item).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ₹{calculateTotal().toLocaleString()}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Prices are per day. Final amount may vary based on rental duration and availability.
              </p>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              Proceed to Checkout
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
