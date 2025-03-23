import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  Tag,
  DollarSign,
} from 'lucide-react';
import { Card } from '../components/ui/card';

const transactions = [
  {
    id: 1,
    description: 'Grocery Shopping',
    amount: -120.50,
    category: 'Food',
    date: '2024-03-20',
    type: 'expense',
  },
  {
    id: 2,
    description: 'Salary Deposit',
    amount: 3500.00,
    category: 'Income',
    date: '2024-03-19',
    type: 'income',
  },
  {
    id: 3,
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    date: '2024-03-18',
    type: 'expense',
  },
  {
    id: 4,
    description: 'Gas Station',
    amount: -45.00,
    category: 'Transportation',
    date: '2024-03-17',
    type: 'expense',
  },
  {
    id: 5,
    description: 'Freelance Work',
    amount: 500.00,
    category: 'Income',
    date: '2024-03-16',
    type: 'income',
  },
  {
    id: 6,
    description: 'Restaurant',
    amount: -85.00,
    category: 'Food',
    date: '2024-03-15',
    type: 'expense',
  },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">Manage and track your financial transactions.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 hover-button">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 hover-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 hover-button">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 hover-button">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden hover-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Amount</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-300">
                      <Tag className="h-4 w-4 mr-2 text-gray-400" />
                      {transaction.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end">
                      <DollarSign className={`h-4 w-4 mr-1 ${
                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`font-medium ${
                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white transition-colors duration-200 hover-button">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 