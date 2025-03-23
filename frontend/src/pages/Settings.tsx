import { motion } from "framer-motion";
import {
  ChevronRight,
  LogOut,
  Save,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { settings } from "../data/sample-data";
export default function Settings() {
  const { signOut } = useAuth();

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </motion.button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settings.map((section) => (
          <Card key={section.id} className="hover-card shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-full bg-gray-800 shadow-lg">
                <section.icon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {section.title}
                </h2>
                <p className="text-gray-400">{section.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gray-700/50">
                      <item.icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Sign Out Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        onClick={signOut}
      >
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </motion.button>
    </div>
  );
}
