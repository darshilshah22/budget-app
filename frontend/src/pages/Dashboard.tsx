import {
  Calendar,
  Plus,
  Settings,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  DollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const monthlyData = [
  { name: 'Jan', income: 5000, expenses: 3500 },
  { name: 'Feb', income: 5500, expenses: 3800 },
  { name: 'Mar', income: 4800, expenses: 3200 },
  { name: 'Apr', income: 6000, expenses: 4000 },
  { name: 'May', income: 5200, expenses: 3600 },
  { name: 'Jun', income: 5800, expenses: 3900 },
];

const categoryData = [
  { name: 'Food', value: 35 },
  { name: 'Transport', value: 25 },
  { name: 'Entertainment', value: 20 },
  { name: 'Shopping', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#4ade80', '#f87171', '#fbbf24', '#60a5fa', '#a78bfa'];

const recentTransactions = [
  {
    id: 1,
    description: 'Grocery Shopping',
    amount: 150.50,
    category: 'Food',
    date: '2024-03-15',
    type: 'expense',
  },
  {
    id: 2,
    description: 'Salary',
    amount: 5000.00,
    category: 'Income',
    date: '2024-03-14',
    type: 'income',
  },
  {
    id: 3,
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    date: '2024-03-13',
    type: 'expense',
  },
];

const summaryCards = [
  {
    title: "Total Balance",
    value: "$24,500",
    change: { value: 12.5, direction: "up" },
    icon: Wallet,
    color: "blue",
  },
  {
    title: "Income",
    value: "$8,200",
    change: { value: 8.2, direction: "up" },
    icon: TrendingUp,
    color: "green",
  },
  {
    title: "Expenses",
    value: "$3,800",
    change: { value: 5.7, direction: "down" },
    icon: CreditCard,
    color: "red",
  },
  {
    title: "Savings",
    value: "$4,400",
    change: { value: 15.3, direction: "up" },
    icon: PiggyBank,
    color: "purple",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Plus,
      label: "Add Transaction",
      onClick: () => navigate("/transactions"),
    },
    {
      icon: PiggyBank,
      label: "Set Budget",
      onClick: () => navigate("/budgets"),
    },
    { icon: Calendar, label: "Schedule", onClick: () => navigate("/calendar") },
    { icon: Settings, label: "Settings", onClick: () => navigate("/settings") },
  ];

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your finances today.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3 text-gray-200 hover:bg-gray-700 hover:scale-105"
            >
              <div className="p-3 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                <action.icon className="w-6 h-6 text-blue-500" />
              </div>
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {
            summaryCards.map((card) => (
              <div className="bg-gray-800 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">{card.title}</h3>
                  <div className="p-2 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                    <card.icon className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-4">{card.value}</p>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUpRight className={`w-4 h-4 mr-1 ${card.change.direction === "up" ? "text-green-400" : "text-red-400"}`} />
                  <span className={`${card.change.direction === "up" ? "text-green-400" : "text-red-400"}`}>{card.change.direction === "up" ? "+" : "-"}{card.change.value}% from last month</span>
                </div>
              </div>
            ))
          }
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-6">
              Monthly Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                      color: "#F3F4F6",
                    }}
                  />
                  <Bar dataKey="income" fill="#4ade80" />
                  <Bar dataKey="expenses" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-6">
              Expense Categories
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "2px solid #374151",
                      borderRadius: "0.5rem",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Recent Transactions Table */}
        <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Category</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="py-4 px-6 text-sm text-gray-300">{transaction.date}</td>
                    <td className="py-4 px-6 text-sm text-white">{transaction.description}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-sm font-medium text-right ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}$ {transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
