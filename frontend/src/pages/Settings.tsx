import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Globe,
  Moon,
  ChevronRight,
  LogOut,
  Save,
  Shield,
  Key,
  Mail,
  Smartphone,
  CreditCard as CardIcon,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: () => void;
}

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  items: SettingItem[];
}

const settings: SettingSection[] = [
  {
    id: "profile",
    title: "Profile Settings",
    description: "Manage your personal information and preferences",
    icon: User,
    items: [
      {
        id: "personal-info",
        title: "Personal Information",
        description: "Update your name, email, and profile picture",
        icon: User,
      },
      {
        id: "notifications",
        title: "Notification Preferences",
        description: "Configure how you receive notifications",
        icon: Bell,
      },
      {
        id: "security",
        title: "Security Settings",
        description: "Manage your password and security options",
        icon: Lock,
      },
    ],
  },
  {
    id: "preferences",
    title: "App Preferences",
    description: "Customize your app experience",
    icon: Globe,
    items: [
      {
        id: "theme",
        title: "Theme Settings",
        description: "Choose between light and dark mode",
        icon: Moon,
      },
      {
        id: "language",
        title: "Language",
        description: "Select your preferred language",
        icon: Globe,
      },
      {
        id: "currency",
        title: "Currency",
        description: "Set your default currency",
        icon: CreditCard,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notification Settings",
    description: "Manage your notification preferences",
    icon: Bell,
    items: [
      {
        id: "email-notifications",
        title: "Email Notifications",
        description: "Configure email notification settings",
        icon: Mail,
      },
      {
        id: "push-notifications",
        title: "Push Notifications",
        description: "Manage push notification preferences",
        icon: Smartphone,
      },
      {
        id: "billing-notifications",
        title: "Billing Notifications",
        description: "Set up billing and payment notifications",
        icon: CardIcon,
      },
    ],
  },
  {
    id: "security",
    title: "Security Settings",
    description: "Manage your account security",
    icon: Shield,
    items: [
      {
        id: "password",
        title: "Password",
        description: "Change your account password",
        icon: Key,
      },
      {
        id: "two-factor",
        title: "Two-Factor Authentication",
        description: "Enable or disable 2FA",
        icon: Shield,
      },
      {
        id: "sessions",
        title: "Active Sessions",
        description: "View and manage active sessions",
        icon: Smartphone,
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Subscription",
    description: "Manage your subscription and billing",
    icon: CreditCard,
    items: [
      {
        id: "subscription",
        title: "Subscription Plan",
        description: "View and manage your subscription",
        icon: CardIcon,
      },
      {
        id: "payment-methods",
        title: "Payment Methods",
        description: "Manage your payment methods",
        icon: CreditCard,
      },
      {
        id: "billing-history",
        title: "Billing History",
        description: "View your billing history",
        icon: CreditCard,
      },
    ],
  },
];

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
