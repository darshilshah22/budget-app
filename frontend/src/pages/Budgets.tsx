import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Upload,
} from 'lucide-react';
import { Card } from '../components/ui/card';

interface Budget {
  id: string;
  category: string;
  spent: number;
  total: number;
  trend: number;
  trendDirection: 'up' | 'down';
  color: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info';
  icon: React.ElementType;
}

const budgets: Budget[] = [
  {
    id: '1',
    category: 'Food & Dining',
    spent: 450,
    total: 600,
    trend: 12.5,
    trendDirection: 'up',
    color: 'blue',
  },
  {
    id: '2',
    category: 'Transportation',
    spent: 280,
    total: 400,
    trend: 8.2,
    trendDirection: 'down',
    color: 'green',
  },
  {
    id: '3',
    category: 'Entertainment',
    spent: 150,
    total: 200,
    trend: 5.7,
    trendDirection: 'up',
    color: 'purple',
  },
  {
    id: '4',
    category: 'Shopping',
    spent: 320,
    total: 500,
    trend: 15.3,
    trendDirection: 'up',
    color: 'red',
  },
  {
    id: '5',
    category: 'Utilities',
    spent: 180,
    total: 250,
    trend: 3.1,
    trendDirection: 'down',
    color: 'yellow',
  },
];

const insights: Insight[] = [
  {
    id: '1',
    title: 'High Spending Alert',
    description: 'Your Food & Dining spending is 75% of the budget.',
    type: 'warning',
    icon: AlertCircle,
  },
  {
    id: '2',
    title: 'Savings Opportunity',
    description: 'You could save $120 by reducing Entertainment expenses.',
    type: 'success',
    icon: TrendingUp,
  },
  {
    id: '3',
    title: 'Budget Optimization',
    description: 'Consider reallocating unused Transportation budget.',
    type: 'info',
    icon: DollarSign,
  },
];

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-yellow-500 to-yellow-600',
};

export default function Budgets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const filteredBudgets = budgets.filter(budget =>
    budget.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Budgets</h1>
          <p className="text-gray-400 mt-1">
          Track and manage your spending across categories.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Budget
          </motion.button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="hover-card">
        <div className="flex items-center justify-between">
          <div className="flex rounded-lg overflow-hidden">
            {(['week', 'month', 'year'] as const).map((period) => (
              <motion.button
                key={period}
                // whileHover={{ scale: 1.05 }}
                // whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPeriod(period)}
                className={`px-8 py-3 text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800 bg-gray-800'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </motion.button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search budgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-72"
              />
            </div>
            <motion.button
              // whileHover={{ scale: 1.05 }}
              // whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </motion.button>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Budget Overview */}
        <div className="lg:col-span-3">
          <div className="relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Budget Overview
                  </h2>
                  <p className="text-gray-400 mt-1">Track your spending across categories</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="space-y-8">
                {filteredBudgets.map((budget) => (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group relative p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/0 to-gray-800/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-500" />
                    
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-5">
                          <div className={`p-3.5 rounded-xl bg-gradient-to-br ${colorMap[budget.color as keyof typeof colorMap]} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                            <DollarSign className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                              {budget.category}
                            </h3>
                            <p className="text-base text-gray-400 mt-1 flex items-center gap-2">
                              <span className="font-medium">${budget.spent.toFixed(2)}</span>
                              <span className="text-gray-500">/</span>
                              <span>${budget.total.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full ${
                            budget.trendDirection === 'up' 
                              ? 'bg-green-500/10 text-green-400' 
                              : 'bg-red-500/10 text-red-400'
                          } flex items-center gap-1 font-medium`}>
                            {budget.trendDirection === 'up' ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            {budget.trend}%
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-700/0 z-10" />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(budget.spent / budget.total) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${colorMap[budget.color as keyof typeof colorMap]} relative`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Insights */}
        <div className="lg:col-span-2">
          <div className="relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Budget Insights
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm">Smart recommendations for your budget</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {insights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group relative p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/0 to-gray-800/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-500" />
                    
                    <div className="relative flex items-start space-x-4">
                      <div className={`p-3.5 rounded-xl ${
                        insight.type === 'warning' 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400' 
                          : insight.type === 'success'
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400'
                          : 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400'
                      } shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <insight.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-white group-hover:text-blue-300 transition-colors duration-300 flex items-center gap-2">
                          {insight.title}
                          <div className={`px-2 py-0.5 text-xs rounded-full ${
                            insight.type === 'warning'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : insight.type === 'success'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                          </div>
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 