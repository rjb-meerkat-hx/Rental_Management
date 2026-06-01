
import React from 'react';
import { Package, Plus, Search, MoreVertical, Edit3, Trash2, Layers } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants.tsx';
import { formatINR, normalizeProduct, denormalizeProduct } from '../utils';

interface Product {
  id: string;
  name: string;
  category: string;
  image?: string;
  stock: number;
  available: number;
  pricePerDay: number;
  pricePerHour?: number;
}

interface Props {
  products?: Product[];
  onAdd?: (p: Partial<Product>) => void;
  onEdit?: (id: string, p: Partial<Product>) => void;
  onDelete?: (id: string) => void;
}

export const ProductManager: React.FC<Props> = ({ products: initialProducts, onAdd, onEdit, onDelete }) => {
  const [products, setProducts] = React.useState<Product[]>(initialProducts || []);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [productForm, setProductForm] = React.useState<Partial<Product>>({
    name: '',
    category: 'General',
    description: '',
    image: '',
    stock: 1,
    available: 1,
    pricePerDay: 0,
    pricePerHour: 0,
  });

  React.useEffect(() => {
    if (!initialProducts) {
      fetch('/api/products')
        .then(r => r.json())
        .then(data => {
          // Normalize all products from server format
          const normalized = data.map(normalizeProduct);
          setProducts(normalized);
        })
        .catch(err => {
          console.error(err);
          // Fallback to mock products
          setProducts(MOCK_PRODUCTS);
        });
    }
  }, [initialProducts]);

  const openNewProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'General',
      description: '',
      image: '',
      stock: 1,
      available: 1,
      pricePerDay: 0,
      pricePerHour: 0,
    });
    setShowProductForm(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      pricePerDay: product.pricePerDay || 0,
      pricePerHour: product.pricePerHour || 0,
      stock: product.stock || 0,
      available: product.available || 0,
    });
    setShowProductForm(true);
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const updateProductForm = (field: string, value: any) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitProductForm = async () => {
    const payload = denormalizeProduct({
      ...productForm,
      stock: Number(productForm.stock || 0),
      available: Number(productForm.available || 0),
      pricePerDay: Number(productForm.pricePerDay || 0),
      pricePerHour: Number(productForm.pricePerHour || 0),
    });

    if (editingProduct) {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      const normalized = normalizeProduct(updated);
      setProducts(prev => prev.map(p => p.id === normalized.id ? normalized : p));
    } else {
      payload.id = payload.id || `p${Date.now()}`;
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      const normalized = normalizeProduct(created);
      setProducts(prev => [normalized, ...prev]);
    }

    closeProductForm();
  };

  const handleAdd = () => {
    if (onAdd) {
      const id = `p${Date.now()}`;
      onAdd({ id, name: '', category: 'General', stock: 1, available: 1, pricePerDay: 0 });
      return;
    }
    openNewProductForm();
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (onEdit) { onEdit(id, { name: product.name }); return; }
    openEditProductForm(product);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    if (onDelete) { onDelete(id); return; }
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Product Inventory</h2>
          <p className="text-slate-500">Manage your rentable assets and availability.</p>
        </div>
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-100">
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
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <img src={product.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80'} className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-100" />
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
                    <p className="text-sm font-bold text-slate-800">{formatINR(product.pricePerDay)}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{formatINR(product.pricePerHour || 0)}/hr</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEdit(product.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 size={16} /></button>
                       <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-sm text-slate-500">Enter full product details, including image URL.</p>
              </div>
              <button onClick={closeProductForm} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">Close</button>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Name
                  <input value={productForm.name || ''} onChange={e => updateProductForm('name', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Category
                  <input value={productForm.category || ''} onChange={e => updateProductForm('category', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Price Per Day
                  <input type="number" value={productForm.pricePerDay ?? 0} onChange={e => updateProductForm('pricePerDay', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Price Per Hour
                  <input type="number" value={productForm.pricePerHour ?? 0} onChange={e => updateProductForm('pricePerHour', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Stock
                  <input type="number" value={productForm.stock ?? 1} onChange={e => updateProductForm('stock', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Available
                  <input type="number" value={productForm.available ?? 1} onChange={e => updateProductForm('available', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
              </div>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Image URL
                <input value={productForm.image || ''} onChange={e => updateProductForm('image', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Description
                <textarea value={productForm.description || ''} onChange={e => updateProductForm('description', e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
              </label>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button onClick={closeProductForm} className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                <button onClick={handleSubmitProductForm} className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Save Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
