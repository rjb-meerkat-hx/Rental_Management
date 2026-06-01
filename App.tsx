
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './views/Dashboard';
import { OrdersList } from './views/OrdersList';
import { OrderDetail } from './views/OrderDetail';
import { ProductManager } from './views/ProductManager';
import { CustomerShop } from './views/CustomerShop';
import { Auth } from './views/Auth';
import { LandingPage } from './views/LandingPage';
import { CustomerManager } from './views/CustomerManager';
import { Reporting } from './views/Reporting';
import { SettingsView } from './views/Settings';
import { RentalStatus, InvoiceStatus, RentalOrder, OrderItem, User, UserRole } from './types';
import { apiFetch, normalizeProduct } from './utils';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'landing' | 'auth'>('landing');
  const [initialAuthRole, setInitialAuthRole] = useState<UserRole>(UserRole.CUSTOMER);

  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [orderDraft, setOrderDraft] = useState({
    propertyId: '',
    tenantId: '',
    startDate: new Date().toISOString().slice(0,10),
    endDate: new Date(Date.now()+7*24*3600*1000).toISOString().slice(0,10),
    monthlyRent: 0,
    securityDeposit: 0,
    status: RentalStatus.RESERVED,
  });

  React.useEffect(() => {
    Promise.all([
      apiFetch('/api/rentals').then(r => r.json()),
      apiFetch('/api/properties').then(r => r.json()),
      apiFetch('/api/tenants').then(r => r.json()),
      apiFetch('/api/products').then(r => r.json())
    ])
      .then(([rentalData, propertyData, tenantData, productData]) => {
        const mapped = rentalData.map((r: any) => ({
          id: `o${r.id}`,
          reference: `R${String(r.id).padStart(4,'0')}`,
          customerName: r.tenant_name,
          customerEmail: r.tenant_email,
          date: r.created_at?.slice(0,10) || '',
          rentalPeriod: { start: r.start_date, end: r.end_date || '' },
          status: r.status,
          invoiceStatus: InvoiceStatus.NOTHING_TO_INVOICE,
          items: [],
          total: r.monthly_rent || 0,
          taxTotal: 0,
          untaxedTotal: r.monthly_rent || 0,
        }));

        setOrders(mapped);
        setProperties(propertyData);
        setTenants(tenantData);
        setProducts(productData.map(normalizeProduct));
      })
      .catch(err => console.error(err));
  }, []);
  // products and customers are managed by their views via API

  const handleOrderSelect = (id: string) => {
    setSelectedOrderId(id);
    setActiveTab('order-detail');
  };

  // Orders handlers
  const handleCreateOrder = () => {
    if (!properties.length || !tenants.length) return alert('No properties or tenants to create rental');
    const property = properties[0];
    setOrderDraft({
      propertyId: property.id,
      tenantId: tenants[0]?.id || '',
      startDate: new Date().toISOString().slice(0,10),
      endDate: new Date(Date.now()+7*24*3600*1000).toISOString().slice(0,10),
      monthlyRent: property.rent_amount || 0,
      securityDeposit: property.rent_amount || 0,
      status: RentalStatus.RESERVED,
    });
    setSelectedProductId(products[0]?.id || '');
    setSelectedQuantity(1);
    setOrderItems([]);
    setShowOrderForm(true);
  };

  const updateOrderDraft = (field: string, value: any) => {
    setOrderDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOrderItem = () => {
    const product = products.find((p: any) => p.id === selectedProductId);
    if (!product) return;
    const quantity = Math.max(1, selectedQuantity);
    setOrderItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? {
          ...item,
          quantity: item.quantity + quantity,
          subtotal: (item.quantity + quantity) * item.unitPrice
        } : item);
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.pricePerDay || 0,
          tax: 0,
          subtotal: quantity * (product.pricePerDay || 0)
        }
      ];
    });
  };

  const handleSubmitOrder = async () => {
    if (!orderDraft.propertyId || !orderDraft.tenantId) {
      return alert('Select a customer and property to create the order');
    }

    try {
      const payload = {
        property_id: orderDraft.propertyId,
        tenant_id: orderDraft.tenantId,
        start_date: orderDraft.startDate,
        end_date: orderDraft.endDate,
        monthly_rent: orderDraft.monthlyRent,
        security_deposit: orderDraft.securityDeposit,
        status: orderDraft.status,
      };

      const res = await apiFetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      const created = await res.json();
      const items = orderItems.length ? orderItems : [{
        productId: orderDraft.propertyId,
        productName: properties.find(p => p.id === orderDraft.propertyId)?.name || 'Rental',
        quantity: 1,
        unitPrice: orderDraft.monthlyRent,
        tax: 0,
        subtotal: orderDraft.monthlyRent,
      }];
      const untaxedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const taxTotal = Number((untaxedTotal * 0.1).toFixed(2));
      const total = untaxedTotal + taxTotal;

      const mapped = {
        id: `o${created.id}`,
        reference: `R${String(created.id).padStart(4,'0')}`,
        customerName: created.tenant_name,
        customerEmail: created.tenant_email,
        date: created.created_at?.slice(0,10) || '',
        rentalPeriod: { start: created.start_date, end: created.end_date || '' },
        status: created.status,
        invoiceStatus: InvoiceStatus.NOTHING_TO_INVOICE,
        items,
        total,
        taxTotal,
        untaxedTotal,
      };

      setOrders(prev => [mapped, ...prev]);
      setShowOrderForm(false);
      setSelectedOrderId(mapped.id);
      setActiveTab('order-detail');
    } catch (e) {
      console.error(e);
      alert('Failed to create order');
    }
  };

  const closeOrderForm = () => {
    setShowOrderForm(false);
  };


  const handleExportOrders = () => {
    const csv = ['reference,customer,email,total'].concat(orders.map(o => `${o.reference},${o.customerName},${o.customerEmail},${o.total}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setSelectedOrderId(null);
    setViewState('landing');
  };

  const handleStartAuth = (isAdmin?: boolean) => {
    setInitialAuthRole(isAdmin ? UserRole.ADMIN : UserRole.CUSTOMER);
    setViewState('auth');
  };

  if (!currentUser) {
    if (viewState === 'landing') {
      return <LandingPage onStartAuth={handleStartAuth} />;
    }
    return (
      <Auth 
        onLogin={setCurrentUser} 
        onBack={() => setViewState('landing')} 
        initialRole={initialAuthRole}
      />
    );
  }

  // Strict Redirection: Customer only sees CustomerShop
  if (currentUser.role === UserRole.CUSTOMER) {
    return <CustomerShop onExit={handleLogout} />;
  }

  // Strict Redirection: Admin only sees Admin Panel
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onOrderSelect={handleOrderSelect} />;
      case 'orders':
        return <OrdersList orders={orders} onOrderSelect={handleOrderSelect} onCreateOrder={handleCreateOrder} onExportOrders={handleExportOrders} />;
      case 'order-detail':
        const order = orders.find(o => o.id === selectedOrderId);
        return <OrderDetail order={order} onBack={() => setActiveTab('orders')} />;
      case 'products':
        return <ProductManager />;
      case 'customers':
        return <CustomerManager />;
      case 'reporting':
        return <Reporting />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard onOrderSelect={handleOrderSelect} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden animate-fade-in">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar userName={currentUser.name} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
      {showOrderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create Rental Order</h3>
                <p className="text-sm text-slate-500">Edit the details before submitting the order.</p>
              </div>
              <button onClick={closeOrderForm} className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">Close</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Customer
                  <select value={orderDraft.tenantId} onChange={e => updateOrderDraft('tenantId', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name} — {tenant.email}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Property
                  <select value={orderDraft.propertyId} onChange={e => {
                    const propertyId = e.target.value;
                    const property = properties.find(p => p.id === propertyId);
                    updateOrderDraft('propertyId', propertyId);
                    if (property) {
                      updateOrderDraft('monthlyRent', property.rent_amount || 0);
                      updateOrderDraft('securityDeposit', property.rent_amount || 0);
                    }
                  }} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>{property.name} — ₹{property.rent_amount?.toLocaleString()}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Start Date
                  <input type="date" value={orderDraft.startDate} onChange={e => updateOrderDraft('startDate', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  End Date
                  <input type="date" value={orderDraft.endDate} onChange={e => updateOrderDraft('endDate', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Status
                  <select value={orderDraft.status} onChange={e => updateOrderDraft('status', e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                    {Object.values(RentalStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Monthly Rent
                  <input type="number" value={orderDraft.monthlyRent} onChange={e => updateOrderDraft('monthlyRent', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Security Deposit
                  <input type="number" value={orderDraft.securityDeposit} onChange={e => updateOrderDraft('securityDeposit', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                </label>
                <div className="space-y-2 text-sm font-medium text-slate-700">
                  Add Product Line
                  <div className="flex gap-3">
                    <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                      <option value="">Select product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                    <input type="number" min={1} value={selectedQuantity} onChange={e => setSelectedQuantity(Number(e.target.value))} className="w-24 rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
                    <button onClick={handleAddOrderItem} className="rounded-2xl bg-indigo-600 px-4 text-white hover:bg-indigo-700">Add</button>
                  </div>
                </div>
              </div>

              {orderItems.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Order items</h4>
                  <div className="space-y-3">
                    {orderItems.map(item => (
                      <div key={item.productId} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <div>
                          <p className="font-semibold text-slate-800">{item.productName}</p>
                          <p className="text-sm text-slate-500">Qty {item.quantity} × ₹{item.unitPrice.toLocaleString()}</p>
                        </div>
                        <p className="font-bold text-slate-900">₹{item.subtotal.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 justify-end">
                <button onClick={closeOrderForm} className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                <button onClick={handleSubmitOrder} className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Save Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
