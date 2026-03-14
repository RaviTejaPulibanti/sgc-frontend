import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variantClasses = {
    underline: {
      container: 'border-b border-gray-200',
      tab: {
        base: 'py-2 px-4 text-sm font-medium transition-colors',
        active: 'text-blue-600 border-b-2 border-blue-600',
        inactive: 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300',
      },
    },
    pills: {
      container: 'space-x-2',
      tab: {
        base: 'py-2 px-4 text-sm font-medium rounded-lg transition-colors',
        active: 'bg-blue-600 text-white',
        inactive: 'text-gray-700 bg-gray-100 hover:bg-gray-200',
      },
    },
  };

  return (
    <div>
      {/* Tab List */}
      <div className={`flex ${variantClasses[variant].container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              ${variantClasses[variant].tab.base}
              ${activeTab === tab.id
                ? variantClasses[variant].tab.active
                : variantClasses[variant].tab.inactive
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;