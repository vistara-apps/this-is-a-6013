import React, { useState } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import Card from './ui/Card'

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const customers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0123',
      source: 'Website',
      lastInteractionDate: '2023-12-15',
      totalSpend: '$2,450',
      status: 'Active'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@techcorp.com',
      phone: '+1-555-0456',
      source: 'Referral',
      lastInteractionDate: '2023-12-14',
      totalSpend: '$5,200',
      status: 'Active'
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Davis',
      email: 'mike.davis@startup.io',
      phone: '+1-555-0789',
      source: 'LinkedIn',
      lastInteractionDate: '2023-12-10',
      totalSpend: '$890',
      status: 'Inactive'
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.chen@design.co',
      phone: '+1-555-0321',
      source: 'Website',
      lastInteractionDate: '2023-12-16',
      totalSpend: '$3,100',
      status: 'Active'
    }
  ]

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const viewCustomerProfile = (customer) => {
    setSelectedCustomer(customer)
  }

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-white/70 hover:text-white mb-2"
            >
              ← Back to Customers
            </button>
            <h1 className="text-3xl font-bold text-white">
              {selectedCustomer.firstName} {selectedCustomer.lastName}
            </h1>
            <p className="text-white/70">Customer Profile</p>
          </div>
          <button className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Customer Details">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Source</label>
                  <p className="text-gray-900">{selectedCustomer.source}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    selectedCustomer.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Recent Interactions">
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium">Email Campaign Response</h4>
                  <p className="text-sm text-gray-600">Clicked on product demo link</p>
                  <p className="text-xs text-gray-400">December 15, 2023</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Purchase Completed</h4>
                  <p className="text-sm text-gray-600">Premium plan subscription - $299</p>
                  <p className="text-xs text-gray-400">December 10, 2023</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Support Ticket Resolved</h4>
                  <p className="text-sm text-gray-600">Integration setup assistance</p>
                  <p className="text-xs text-gray-400">December 8, 2023</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Quick Stats">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Spend</label>
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalSpend}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Interaction</label>
                  <p className="text-gray-900">{selectedCustomer.lastInteractionDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer Since</label>
                  <p className="text-gray-900">January 2023</p>
                </div>
              </div>
            </Card>

            <Card title="Active Tasks">
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-sm">Follow-up call scheduled</h4>
                  <p className="text-xs text-gray-600">Due: Today, 3:00 PM</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm">Send integration guide</h4>
                  <p className="text-xs text-gray-600">Due: Tomorrow</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
          <p className="text-white/70">Manage your unified customer profiles</p>
        </div>
        <button className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Source</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Last Interaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total Spend</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                  <td className="py-3 px-4 text-gray-600">{customer.source}</td>
                  <td className="py-3 px-4 text-gray-600">{customer.lastInteractionDate}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{customer.totalSpend}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      customer.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewCustomerProfile(customer)}
                        className="p-1 text-gray-400 hover:text-purple-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Customers