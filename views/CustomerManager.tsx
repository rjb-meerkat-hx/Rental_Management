import React from 'react';
import { Users, Plus, Search, Mail, Phone, Calendar } from 'lucide-react';
import { apiFetch } from '../utils';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalRentals: number;
  status: 'active' | 'inactive';
}

interface Props {
  customers: Customer[];
  onAddCustomer?: (c: Partial<Customer>) => void;
  onViewCustomer?: (id: string) => void;
}

export const CustomerManager: React.FC<Props> = ({ customers: initialCustomers, onAddCustomer, onViewCustomer }) => {
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers || []);

  const normalizeTenant = (tenant: any): Customer => ({
    id: tenant.id,
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone,
    joinDate: tenant.created_at ? tenant.created_at.slice(0, 10) : 'N/A',
    totalRentals: tenant.totalRentals || 0,
    status: tenant.status || 'active'
  });

  React.useEffect(() => {
    if (!initialCustomers) {
      apiFetch('/api/tenants')
        .then(r => r.json())
        .then((data) => setCustomers(data.map(normalizeTenant)))
        .catch(err => console.error(err));
    }
  }, [initialCustomers]);

  const handleAdd = async () => {
    const name = window.prompt('Customer name');
    if (!name) return;
    const email = window.prompt('Email');
    const phone = window.prompt('Phone');
    const payload = { name, email, phone };
    if (onAddCustomer) { onAddCustomer(payload as any); return; }
    const res = await apiFetch('/api/tenants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const created = await res.json();
    setCustomers(prev => [normalizeTenant(created), ...prev]);
  };

  const handleView = async (id: string) => {
    if (onViewCustomer) { onViewCustomer(id); return; }
    try {
      const res = await apiFetch(`/api/tenants/${id}`);
      if (!res.ok) throw new Error('Unable to fetch customer');
      const data = await res.json();
      alert(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}`);
    } catch (error) {
      console.error(error);
      alert('Failed to load customer details.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rentals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} onClick={() => handleView(customer.id)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Users size={20} className="text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalRentals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
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
