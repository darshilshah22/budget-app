import {
  Calendar,
  Plus,
  Settings,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

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
    amount: -150.50,
    category: 'Food',
    date: '2024-03-15',
  },
  {
    id: 2,
    description: 'Salary',
    amount: 5000.00,
    category: 'Income',
    date: '2024-03-14',
  },
  {
    id: 3,
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    date: '2024-03-13',
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
    <div className="space-y-8 animate-fade-in">
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
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">Total Balance</h3>
              <div className="p-2 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                <Wallet className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-2">$12,345.67</p>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+2.5% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">Monthly Income</h3>
              <div className="p-2 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-2">$5,678.90</p>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+8.2% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">Monthly Expenses</h3>
              <div className="p-2 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-300">
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-2">$3,456.78</p>
            <div className="flex items-center text-red-400 text-sm">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span>-2.1% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm">Savings Rate</h3>
              <div className="p-2 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-300">
                <PiggyBank className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-2">32.5%</p>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+5.3% from last month</span>
            </div>
          </div>
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
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                      color: "#F3F4F6",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">
              Recent Transactions
            </h2>
            <button
              onClick={() => navigate("/transactions")}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      transaction.amount > 0
                        ? "bg-green-500/10 group-hover:bg-green-500/20"
                        : "bg-red-500/10 group-hover:bg-red-500/20"
                    } transition-colors duration-200`}
                  >
                    {transaction.amount > 0 ? (
                      <DollarSign className="w-5 h-5 text-green-400" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-400">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.amount > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
