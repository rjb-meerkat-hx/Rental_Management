
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { apiFetch, formatINR } from '../utils';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

interface DashboardProps {
  onOrderSelect: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOrderSelect }) => {
  const [revenueData, setRevenueData] = useState([
    { name: 'Mon', revenue: 4000, rentals: 24 },
    { name: 'Tue', revenue: 3000, rentals: 18 },
    { name: 'Wed', revenue: 2000, rentals: 12 },
    { name: 'Thu', revenue: 2780, rentals: 22 },
    { name: 'Fri', revenue: 1890, rentals: 15 },
    { name: 'Sat', revenue: 2390, rentals: 10 },
    { name: 'Sun', revenue: 3490, rentals: 30 },
  ]);

  const [stats, setStats] = useState({
    quotations: '0',
    activeRentals: '0',
    totalRevenue: '₹0',
    newCustomers: '0'
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rentals, tenants] = await Promise.all([
          apiFetch('/api/rentals').then(r => r.json()),
          apiFetch('/api/tenants').then(r => r.json())
        ]);

        const totalRevenue = rentals.reduce((sum: number, r: any) => sum + (r.monthly_rent || 0), 0);
        const activeRentals = rentals.filter((r: any) => r.status === 'active').length;
        const totalCustomers = tenants.length;

        setStats({
          quotations: String(rentals.length),
          activeRentals: String(activeRentals),
          totalRevenue: formatINR(totalRevenue),
          newCustomers: String(totalCustomers)
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Quotations" value={stats.quotations} icon={DollarSign} trend={12.5} color="bg-indigo-500" />
        <StatCard title="Active Rentals" value={stats.activeRentals} icon={Package} trend={-2.4} color="bg-amber-500" />
        <StatCard title="Total Revenue" value={stats.totalRevenue} icon={TrendingUp} trend={8.1} color="bg-emerald-500" />
        <StatCard title="New Customers" value={stats.newCustomers} icon={Users} trend={15.3} color="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Rentals by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { category: 'Machinery', value: 450 },
                { category: 'Furniture', value: 320 },
                { category: 'Tools', value: 280 },
                { category: 'Event PA', value: 210 },
                { category: 'AC Units', value: 150 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
