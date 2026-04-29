
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
import { RentalStatus, InvoiceStatus, RentalOrder, User, UserRole } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'landing' | 'auth'>('landing');
  const [initialAuthRole, setInitialAuthRole] = useState<UserRole>(UserRole.CUSTOMER);

  const [orders, setOrders] = useState<RentalOrder[]>([
    {
      id: 'o1',
      reference: 'R0001',
      customerName: 'Adam J.',
      customerEmail: 'adam@example.com',
      date: '2024-10-15',
      rentalPeriod: { start: '2024-10-20', end: '2024-10-25' },
      status: RentalStatus.PICKED_UP,
      invoiceStatus: InvoiceStatus.FULLY_INVOICED,
      items: [
        { productId: 'p1', productName: 'Industrial Generator X500', quantity: 1, unitPrice: 250, tax: 25, subtotal: 275 }
      ],
      total: 275,
      taxTotal: 25,
      untaxedTotal: 250,
    },
    {
      id: 'o2',
      reference: 'R0002',
      customerName: 'Sufiyan K.',
      customerEmail: 'sufiyan@enterprise.com',
      date: '2024-10-18',
      rentalPeriod: { start: '2024-10-22', end: '2024-10-24' },
      status: RentalStatus.QUOTATION,
      invoiceStatus: InvoiceStatus.NOTHING_TO_INVOICE,
      items: [
        { productId: 'p3', productName: 'Event Sound System Pro', quantity: 2, unitPrice: 350, tax: 70, subtotal: 770 }
      ],
      total: 770,
      taxTotal: 70,
      untaxedTotal: 700,
    }
  ]);

  const handleOrderSelect = (id: string) => {
    setSelectedOrderId(id);
    setActiveTab('order-detail');
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
        return <OrdersList orders={orders} onOrderSelect={handleOrderSelect} />;
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
    </div>
  );
};

export default App;
