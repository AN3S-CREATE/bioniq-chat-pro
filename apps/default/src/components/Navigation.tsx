import React from 'react';
import { MessageSquare, Shield, Users, ShoppingCart, Wrench, Database, Smartphone, Settings, Eye, Maximize2 } from 'lucide-react';

type ModuleType = 'whatsapp-demo' | 'what-you-can-do' | 'data-integration' | 'chat' | 'security' | 'customer-service' | 'ecommerce' | 'installation' | 'admin';

interface NavigationProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  onFullScreenWhatsApp: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeModule, onModuleChange, onFullScreenWhatsApp }) => {
  const mainModules = [
    {
      id: 'whatsapp-demo' as ModuleType,
      name: 'WhatsApp Support',
      icon: Smartphone,
      description: 'Chat with our AI assistant',
      priority: 1
    },
    {
      id: 'what-you-can-do' as ModuleType,
      name: 'What You Can Do',
      icon: Settings,
      description: 'Discover all bot capabilities',
      priority: 2
    },
    {
      id: 'security' as ModuleType,
      name: 'Account Security',
      icon: Shield,
      description: '2FA, data protection, secure access',
      priority: 3
    },
    {
      id: 'customer-service' as ModuleType,
      name: 'Customer Service',
      icon: Users,
      description: '24/7 support, FAQ, agent handoff',
      priority: 4
    },
    {
      id: 'ecommerce' as ModuleType,
      name: 'Order Management',
      icon: ShoppingCart,
      description: 'Track orders, manage returns',
      priority: 5
    },
    {
      id: 'installation' as ModuleType,
      name: 'Installation Support',
      icon: Wrench,
      description: 'Guides, troubleshooting, scheduling',
      priority: 6
    },
    {
      id: 'chat' as ModuleType,
      name: 'Chat Features',
      icon: MessageSquare,
      description: 'Advanced chat capabilities',
      priority: 7
    },
    {
      id: 'data-integration' as ModuleType,
      name: 'System Integration',
      icon: Database,
      description: 'Backend data & API integration',
      priority: 8
    }
  ];

  return (
    <div className="mb-6 md:mb-8">
      {/* Mobile-First Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {mainModules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-200 text-left relative ${
                isActive
                  ? 'border-blue-600 bg-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:transform hover:scale-102'
              }`}
            >
              <div className="flex items-center space-x-2 md:space-x-3 mb-1 md:mb-2">
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                <h3 className={`font-semibold text-sm md:text-base ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
                  {module.name}
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-600 leading-tight">{module.description}</p>
            </button>
          );
        })}

        {/* Try Full WhatsApp Experience Button */}
        <button
          onClick={onFullScreenWhatsApp}
          className="p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-200 text-left shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <div className="flex items-center space-x-2 md:space-x-3 mb-1 md:mb-2">
            <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h3 className="font-semibold text-sm md:text-base text-green-800">
              Try Full WhatsApp Experience
            </h3>
          </div>
          <p className="text-xs md:text-sm text-green-700 leading-tight">Open larger interface for better testing</p>
        </button>
      </div>

      {/* Admin Section - Separate and Clearly Marked */}
      <div className="mt-6 md:mt-8">
        <div className="bg-gray-100 rounded-lg p-3 md:p-4">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center text-sm md:text-base">
            <Eye className="w-4 h-4 mr-2" />
            Admin Section
          </h4>
          <button
            onClick={() => onModuleChange('admin')}
            className={`w-full p-3 md:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              activeModule === 'admin'
                ? 'border-red-500 bg-red-50 shadow-lg transform scale-105'
                : 'border-gray-300 bg-white hover:border-red-300 hover:shadow-md hover:transform hover:scale-102'
            }`}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <Shield className={`w-5 h-5 md:w-6 md:h-6 ${activeModule === 'admin' ? 'text-red-600' : 'text-gray-600'}`} />
              <div className="flex-1">
                <h5 className={`font-semibold text-sm md:text-base ${activeModule === 'admin' ? 'text-red-600' : 'text-gray-800'}`}>
                  Customer Feedback & Analytics
                </h5>
                <p className="text-xs md:text-sm text-gray-600 leading-tight">Admin-only access to customer feedback and system analytics</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};