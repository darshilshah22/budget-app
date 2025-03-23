import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Tag
} from "lucide-react";
import { cn } from "../../lib/utils";

interface AddTransactionFormProps {
  onSubmit: (transaction: {
    description: string;
    amount: number;
    category: string;
    date: string;
    type: "income" | "expense";
  }) => void;
  onCancel: () => void;
}

// Predefined categories for expenses and income
const expenseCategories = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Dining Out",
  "Education",
  "Travel",
  "Insurance",
  "Personal Care",
  "Gifts",
  "Other",
];

const incomeCategories = [
  "Salary",
  "Freelance",
  "Investments",
  "Business",
  "Rental Income",
  "Side Projects",
  "Bonus",
  "Other",
];

export function AddTransactionForm({
  onSubmit,
  onCancel,
}: AddTransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    customCategory: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: formData.category === "Other" ? formData.customCategory : formData.category,
      amount:
        type === "income" ? Number(formData.amount) : -Number(formData.amount),
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Transaction Type
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "p-1.5 rounded-full",
                  type === "expense" ? "bg-red-500/20" : "bg-green-500/20"
                )}
              >
                {type === "expense" ? (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                )}
              </div>
              <span className={cn(
                "font-medium",
                type === "expense" ? "text-red-500" : "text-green-500"
              )}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              showTypeDropdown && "transform rotate-180"
            )} />
          </button>

          {/* Dropdown Menu */}
          {showTypeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-gray-800/95 border border-gray-700 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={() => {
                  setType("expense");
                  setShowTypeDropdown(false);
                }}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-2 transition-colors duration-200",
                  type === "expense" 
                    ? "bg-red-500/10 text-red-500"
                    : "text-gray-300 hover:bg-gray-700/50"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full",
                  type === "expense" ? "bg-red-500/20" : "bg-gray-700"
                )}>
                  <ArrowDownRight className="h-4 w-4" />
                </div>
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("income");
                  setShowTypeDropdown(false);
                }}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-2 transition-colors duration-200",
                  type === "income"
                    ? "bg-green-500/10 text-green-500"
                    : "text-gray-300 hover:bg-gray-700/50"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full",
                  type === "income" ? "bg-green-500/20" : "bg-gray-700"
                )}>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                Income
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            placeholder="Enter transaction description"
          />
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount
        </label>
        <div className="relative">
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            placeholder="0.00"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
            $
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
          {(type === "expense" ? expenseCategories : incomeCategories).map(
            (category) => (
              <motion.button
                key={category}
                type="button"
                // whileHover={{ scale: 1.02 }}
                // whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ 
                  ...formData, 
                  category,
                  customCategory: category === "Other" ? formData.customCategory : ""
                })}
                className={cn(
                  "py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 text-center",
                  formData.category === category
                    ? type === "expense"
                      ? "bg-red-500/40 text-white shadow-lg"
                      : "bg-green-500/40 text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700"
                )}
              >
                {category}
              </motion.button>
            )
          )}
        </div>

        {/* Custom Category Input */}
        {formData.category === "Other" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <input
              type="text"
              required
              value={formData.customCategory}
              onChange={(e) =>
                setFormData({ ...formData, customCategory: e.target.value })
              }
              placeholder="Enter custom category"
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </motion.div>
        )}
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Date
        </label>
        <div className="relative">
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white"/>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 py-3 px-4 text-sm font-medium text-gray-300 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-all duration-200"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-blue-500/90 to-blue-600/90 rounded-xl hover:from-blue-600/90 hover:to-blue-700/90 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Add Transaction
        </motion.button>
      </div>
    </form>
  );
}
