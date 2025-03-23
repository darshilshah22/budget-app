import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Tag,
  DollarSign,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/ui/card';

const categories = [
  {
    id: 1,
    name: 'Food & Dining',
    type: 'expense',
    color: 'blue',
    transactions: 45,
    total: 1200.50,
    trend: '+8%',
    trendDirection: 'up',
  },
  {
    id: 2,
    name: 'Transportation',
    type: 'expense',
    color: 'green',
    transactions: 32,
    total: 450.75,
    trend: '-3%',
    trendDirection: 'down',
  },
  {
    id: 3,
    name: 'Entertainment',
    type: 'expense',
    color: 'purple',
    transactions: 28,
    total: 350.25,
    trend: '+12%',
    trendDirection: 'up',
  },
  {
    id: 4,
    name: 'Shopping',
    type: 'expense',
    color: 'orange',
    transactions: 56,
    total: 850.00,
    trend: '+5%',
    trendDirection: 'up',
  },
  {
    id: 5,
    name: 'Utilities',
    type: 'expense',
    color: 'red',
    transactions: 12,
    total: 250.50,
    trend: '-2%',
    trendDirection: 'down',
  },
  {
    id: 6,
    name: 'Salary',
    type: 'income',
    color: 'green',
    transactions: 4,
    total: 5000.00,
    trend: '+5%',
    trendDirection: 'up',
  },
  {
    id: 7,
    name: 'Freelance',
    type: 'income',
    color: 'blue',
    transactions: 8,
    total: 1200.00,
    trend: '+15%',
    trendDirection: 'up',
  },
  {
    id: 8,
    name: 'Investments',
    type: 'income',
    color: 'purple',
    transactions: 3,
    total: 750.00,
    trend: '+8%',
    trendDirection: 'up',
  },
];

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  purple: 'bg-purple-500/10 text-purple-500',
  orange: 'bg-orange-500/10 text-orange-500',
  red: 'bg-red-500/10 text-red-500',
};

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || category.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Categories</h1>
          <p className="text-gray-400 mt-1">Manage your transaction categories and track spending patterns.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover-button">
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 hover-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg overflow-hidden">
              {['all', 'expense', 'income'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as 'all' | 'expense' | 'income')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 hover-button">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="p-6 hover-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${colorMap[category.color as keyof typeof colorMap]}`}>
                  <Tag className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">{category.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{category.type}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors duration-200 hover-button">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">Total</span>
                </div>
                <span className="text-lg font-semibold text-white">
                  ${category.total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Transactions</span>
                </div>
                <span className="text-sm text-gray-300">{category.transactions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Trend</span>
                <span className={`text-sm font-medium ${
                  category.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {category.trend}
                </span>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 hover-button">
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
} 