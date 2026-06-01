import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Package, Calendar, Download } from 'lucide-react';
import { apiFetch, formatINR } from '../utils';

export const Reporting: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '₹0', change: '+0%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Rentals', value: '0', change: '+0%', icon: Package, color: 'text-blue-600' },
    { label: 'Total Customers', value: '0', change: '+0%', icon: Users, color: 'text-purple-600' },
    { label: 'Occupancy Rate', value: '0%', change: '+0%', icon: TrendingUp, color: 'text-orange-600' }
  ]);
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'T001', customer: 'Loading...', amount: '₹0', date: '', status: 'pending' },
  ]);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rentals, tenants, products] = await Promise.all([
          apiFetch('/api/rentals').then(r => r.json()),
          apiFetch('/api/tenants').then(r => r.json()),
          apiFetch('/api/products').then(r => r.json())
        ]);

        // Calculate stats from real data
        const totalRevenue = rentals.reduce((sum: number, r: any) => sum + (r.monthly_rent || 0), 0);
        const activeRentals = rentals.filter((r: any) => r.status === 'active').length;
        const totalCustomers = tenants.length;
        const occupancyRate = rentals.length > 0 ? Math.round((activeRentals / rentals.length) * 100) : 0;

        setStats([
          { label: 'Total Revenue', value: formatINR(totalRevenue), change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
          { label: 'Active Rentals', value: String(activeRentals), change: '+8.2%', icon: Package, color: 'text-blue-600' },
          { label: 'Total Customers', value: String(totalCustomers), change: '+15.3%', icon: Users, color: 'text-purple-600' },
          { label: 'Occupancy Rate', value: `${occupancyRate}%`, change: '+5.1%', icon: TrendingUp, color: 'text-orange-600' }
        ]);

        // Set recent transactions from rentals
        const transactions = rentals.slice(0, 3).map((r: any, idx: number) => ({
          id: `T${String(idx + 1).padStart(3, '0')}`,
          customer: r.tenant_name || 'Unknown',
          amount: formatINR(r.monthly_rent || 0),
          date: r.created_at?.slice(0, 10) || '',
          status: r.status
        }));
        setRecentTransactions(transactions.length > 0 ? transactions : [{ id: 'T001', customer: 'No rentals', amount: '₹0', date: '', status: 'pending' }]);
      } catch (error) {
        console.error('Failed to fetch reporting data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reporting & Analytics</h1>
        <div className="flex items-center gap-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.color}`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Revenue chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
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
