
import React, { useState } from 'react';
import { 
  LogOut, ShoppingCart, Heart, Search, Filter, 
  LayoutGrid, List, ChevronRight, Star, Clock, Sparkles
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants.tsx';
import { Chatbot, ChatbotButton } from '../components/Chatbot';
import { Cart } from '../components/Cart';

interface CustomerShopProps {
  onExit: () => void;
}

export const CustomerShop: React.FC<CustomerShopProps> = ({ onExit }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartCount, setCartCount] = useState(0);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Collections');

  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        product,
        quantity: 1,
        rentalDays: 1
      }]);
    }
    
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0) + 1);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
    
    setCartCount(cartItems.reduce((total, item) => 
      total + (item.id === id ? quantity : item.quantity), 0
    ));
  };

  const updateCartDays = (id: string, days: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, rentalDays: days } : item
    ));
  };

  const removeFromCart = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(cartItems.filter(item => item.id !== id));
    setCartCount(cartCount - (item?.quantity || 0));
  };

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here. Total items: ' + cartItems.length);
    setIsCartOpen(false);
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'All Collections') {
      return MOCK_PRODUCTS;
    }
    
    const categoryMap: { [key: string]: string } = {
      'Power & Energy': 'Construction',
      'Executive Workspace': 'Furniture', 
      'Smart Tech': 'Electronics',
      'Heavy Duty': 'Machinery',
      'Pro Events': 'Electronics',
      'Climate Control': 'Climate Control'
    };
    
    const mappedCategory = categoryMap[selectedCategory];
    return MOCK_PRODUCTS.filter(product => product.category === mappedCategory);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in overflow-y-auto">
      {/* Shop Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tighter flex items-center gap-2">
              Marketplace <Sparkles className="text-amber-400 fill-amber-400" size={20} />
            </h1>
          </div>

          <div className="flex items-center gap-5">
             <div className="relative group hidden sm:block">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search premium gear..." 
                  className="pl-12 pr-6 py-2.5 bg-slate-100 rounded-2xl text-sm w-72 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none border border-transparent focus:border-indigo-100 font-medium"
                />
             </div>
             <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all active:scale-90">
                <Heart size={22} />
             </button>
             <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-3 bg-indigo-600 text-white pl-5 pr-2 py-2 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all hover:bg-indigo-700"
              >
                <span>{cartCount} Items</span>
                <div className="bg-indigo-500 p-1.5 rounded-xl">
                  <ShoppingCart size={18} />
                </div>
             </button>
             <div className="h-8 w-px bg-slate-200 ml-2"></div>
             <button 
              onClick={onExit}
              className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold text-sm transition-colors group px-2"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Categories Bar */}
      <div className="bg-white border-b border-slate-100 overflow-x-auto shadow-sm">
        <div className="max-w-7xl mx-auto px-8 flex gap-10 py-4">
          {['All Collections', 'Power & Energy', 'Executive Workspace', 'Smart Tech', 'Heavy Duty', 'Climate Control'].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`text-sm font-bold whitespace-nowrap transition-all relative py-1 ${
                selectedCategory === cat ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              {cat}
              {selectedCategory === cat && <div className="absolute -bottom-1 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 flex gap-10">
        {/* Sidebar Filters */}
        <aside className="w-72 shrink-0 space-y-10 hidden lg:block">
           <div className="animate-slide-up" style={{animationDelay: '100ms'}}>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-6">Status</h3>
              <div className="space-y-4">
                 <label className="flex items-center gap-4 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Available Immediately</span>
                 </label>
                 <label className="flex items-center gap-4 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Upcoming Stock</span>
                 </label>
              </div>
           </div>

           <div className="animate-slide-up" style={{animationDelay: '200ms'}}>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-6">Price Preference</h3>
              <div className="px-1">
                <input type="range" className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="flex justify-between mt-3 text-xs text-slate-500 font-bold">
                 <span>₹4,000</span>
                 <span>₹4,00,000+</span>
              </div>
           </div>

           <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden animate-slide-up shadow-2xl shadow-indigo-200" style={{animationDelay: '300ms'}}>
              <div className="relative z-10">
                <h4 className="font-black text-2xl mb-4 leading-tight">Need a Custom Quote?</h4>
                <p className="text-indigo-200 text-sm mb-8 leading-relaxed font-medium">Our specialists can curate a bulk rental package for your project in under 2 hours.</p>
                <button 
                  onClick={() => setIsChatbotOpen(true)}
                  className="bg-white text-indigo-900 w-full py-4 rounded-2xl text-sm font-black shadow-xl hover:bg-indigo-50 active:scale-95 transition-all"
                >
                   TALK TO AN EXPERT
                </button>
              </div>
              <Star size={120} className="absolute -bottom-10 -right-10 text-indigo-800 opacity-30 rotate-12" />
           </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Featured Gear</h2>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-20' : 'flex flex-col gap-8 pb-20'}>
            {getFilteredProducts().length > 0 ? (
              getFilteredProducts().map((product, idx) => (
              <div 
                key={product.id}
                className={`bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 group animate-slide-up relative`}
                style={{animationDelay: `${idx * 100}ms`}}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-80 h-full shrink-0' : 'aspect-[4/3]'}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-slate-800 uppercase tracking-widest shadow-xl">
                       {product.category}
                    </span>
                  </div>
                  <button className="absolute bottom-6 right-6 p-3 bg-white rounded-full text-slate-400 hover:text-rose-500 shadow-2xl translate-y-24 group-hover:translate-y-0 transition-all duration-700 hover:scale-110">
                     <Heart size={22} fill="currentColor" className="fill-transparent hover:fill-rose-500 transition-colors" />
                  </button>
                </div>

                <div className={`p-8 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1 h-full' : ''}`}>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl mb-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-6">
                       <span className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest"><Clock size={14} className="text-indigo-400" /> Flexible Days</span>
                       <span className="flex items-center gap-2 text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
                        {product.available} Ready
                       </span>
                    </div>
                  </div>

                  <div className={`mt-10 pt-6 border-t border-slate-100 flex items-center justify-between ${viewMode === 'list' ? 'mt-0' : ''}`}>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Standard Rate</p>
                      <p className="text-3xl font-black text-slate-800">₹{product.pricePerDay}<span className="text-base font-bold text-slate-300 ml-1">/day</span></p>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 text-white p-5 rounded-3xl hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-indigo-100 group-hover:rotate-6"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Chatbot Components */}
      <ChatbotButton onOpen={() => setIsChatbotOpen(true)} />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      
      {/* Cart Component */}
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onUpdateDays={updateCartDays}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
