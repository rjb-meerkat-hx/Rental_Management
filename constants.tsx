
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  History,
  AlertCircle,
  Truck,
  CreditCard,
  FileText
} from 'lucide-react';

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Industrial Generator X500',
    description: 'High-power diesel generator for large construction sites.',
    category: 'Construction',
    image: 'https://businessoutstanders.s3.amazonaws.com/news/2025/5/industrial-generators-for-manufacturing-and-remote-power-supply.webp',
    pricePerHour: 3600,
    pricePerDay: 20000,
    pricePerWeek: 96000,
    stock: 5,
    available: 3
  },
  {
    id: 'p2',
    name: 'Executive Office Set',
    description: 'Premium desk, chair, and storage for corporate events.',
    category: 'Furniture',
    image: 'https://www.countrysideamishfurniture.com/media/made/media/uploads/Catalog/50013/2016/cavalier_executive_office_set_940_620_80_s_c1_c.jpg',
    pricePerHour: 1200,
    pricePerDay: 6400,
    pricePerWeek: 32000,
    stock: 12,
    available: 8
  },
  {
    id: 'p3',
    name: 'Event Sound System Pro',
    description: 'Complete PA system with mixers, mics, and line arrays.',
    category: 'Electronics',
    image: 'https://www.doremievent.com/wp-content/uploads/2023/01/PA-system-800x600.jpg',
    pricePerHour: 4800,
    pricePerDay: 28000,
    pricePerWeek: 144000,
    stock: 4,
    available: 2
  },
  {
    id: 'p4',
    name: 'Mobile Forklift 2.5T',
    description: 'Heavy duty electric forklift for warehouse operations.',
    category: 'Machinery',
    image: 'https://kapitus.com/wp-content/uploads/Excavator-med.jpg',
    pricePerHour: 2800,
    pricePerDay: 14400,
    pricePerWeek: 72000,
    stock: 8,
    available: 5
  },
  {
    id: 'p5',
    name: 'Portable AC Unit 12000 BTU',
    description: 'Quick cooling solution for temporary spaces.',
    category: 'Climate Control',
    image: 'https://www.connectedaudiovisual.com.au/wp-content/uploads/2023/12/climate-control.png',
    pricePerHour: 800,
    pricePerDay: 4000,
    pricePerWeek: 20000,
    stock: 20,
    available: 15
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'orders', label: 'Rental Orders', icon: <FileText size={20} /> },
  { id: 'products', label: 'Products', icon: <Package size={20} /> },
  { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  { id: 'reporting', label: 'Reporting', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const STATUS_COLORS = {
  Quotation: 'bg-amber-100 text-amber-700 border-amber-200',
  Reserved: 'bg-blue-100 text-blue-700 border-blue-200',
  'Picked Up': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Returned: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
};

export const INVOICE_STATUS_COLORS = {
  'Nothing to Invoice': 'bg-slate-100 text-slate-600',
  'To Invoice': 'bg-indigo-50 text-indigo-600',
  'Fully Invoiced': 'bg-emerald-50 text-emerald-600',
};
