import React from 'react';
import { Home, LayoutGrid, ClipboardList, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItemConfig {
  key: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { key: 'Home', label: 'Home', icon: Home },
  { key: 'Categories', label: 'Categories', icon: LayoutGrid },
  { key: 'Orders', label: 'Orders', icon: ClipboardList },
  { key: 'Profile', label: 'Profile', icon: User },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="h-16 bg-white border-t border-gray-100 flex items-center justify-around shrink-0 pb-1 z-40 sticky bottom-0 left-0 right-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.key;
        const IconComponent = item.icon;

        return (
          <button
            key={item.key}
            id={`nav-tab-${item.key.toLowerCase()}`}
            onClick={() => onTabChange(item.key)}
            className="flex flex-col items-center gap-1 cursor-pointer py-1 px-2 group focus:outline-none"
          >
            <IconComponent
              className={`w-5 h-5 transition-colors duration-150 ${
                isActive
                  ? 'text-[#FF8C00] stroke-[2.2]'
                  : 'text-[#001f3f] stroke-[2] group-hover:text-gray-600'
              }`}
            />

            <span
              className={`text-[10px] transition-colors duration-150 ${
                isActive
                  ? 'font-bold text-[#FF8C00]'
                  : 'font-medium text-gray-400 group-hover:text-gray-600'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
