import React, { useState } from 'react';
import { Wifi, Shield, Zap, Menu, X, Settings, Users, ShoppingCart, Wrench, MessageSquare, Database, Eye, Maximize2, Contrast } from 'lucide-react';

type ModuleType = 'whatsapp-demo' | 'what-you-can-do' | 'data-integration' | 'chat' | 'security' | 'customer-service' | 'ecommerce' | 'installation' | 'admin' | 'accessibility';

interface HeaderProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  onFullScreenWhatsApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeModule, onModuleChange, onFullScreenWhatsApp }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'what-you-can-do' as ModuleType, label: 'What You Can Do', icon: Settings, color: 'text-cyan-300 hover:text-cyan-200' },
    { id: 'security' as ModuleType, label: 'Account Security', icon: Shield, color: 'text-green-300 hover:text-green-200' },
    { id: 'customer-service' as ModuleType, label: 'Customer Service', icon: Users, color: 'text-purple-300 hover:text-purple-200' },
    { id: 'ecommerce' as ModuleType, label: 'Order Management', icon: ShoppingCart, color: 'text-pink-300 hover:text-pink-200' },
    { id: 'installation' as ModuleType, label: 'Installation Support', icon: Wrench, color: 'text-orange-300 hover:text-orange-200' },
    { id: 'chat' as ModuleType, label: 'Chat Features', icon: MessageSquare, color: 'text-blue-300 hover:text-blue-200' },
    { id: 'data-integration' as ModuleType, label: 'System Integration', icon: Database, color: 'text-indigo-300 hover:text-indigo-200' },
    { id: 'accessibility' as ModuleType, label: 'Accessibility Testing', icon: Contrast, color: 'text-yellow-300 hover:text-yellow-200' },
  ];

  return (
    <header className="bg-gray-900 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-gray-800 border border-cyan-500/50 p-1.5 md:p-2 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/30">
              <img 
                src="https://iili.io/K70LoAJ.png" 
                alt="Bioniq Logo" 
                className="w-6 md:w-8 h-6 md:h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Wifi className="w-6 md:w-8 h-6 md:h-8 text-cyan-300 hidden" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Bioniq</h1>
              <p className="text-xs md:text-sm text-gray-300 hidden sm:block">Unrestricted, Uncapped Internet</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-cyan-300">
              <Shield className="w-4 h-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
              <span className="font-medium text-sm">Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-300">
              <Zap className="w-4 h-4 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
              <span className="font-medium text-sm">High-Speed</span>
            </div>
            
            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onModuleChange(item.id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-700 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/30'
                        : `${item.color} hover:bg-gray-800/50 border border-transparent hover:border-gray-600`
                    }`}
                    title={item.label}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : ''}`} />
                  </button>
                );
              })}
              
              {/* Try Full WhatsApp Experience */}
              <button
                onClick={onFullScreenWhatsApp}
                className="px-2 py-1 rounded text-xs font-medium bg-gray-700 border border-green-500/50 text-green-300 hover:bg-gray-600 transition-all duration-200 shadow-lg shadow-green-500/30"
                title="Try Full WhatsApp Experience"
              >
                <Maximize2 className="w-4 h-4 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              </button>
              
              {/* Admin Section */}
              <button
                onClick={() => onModuleChange('admin')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  activeModule === 'admin'
                    ? 'bg-gray-700 border border-red-500/50 text-red-300 shadow-lg shadow-red-500/30'
                    : 'text-red-300 hover:text-red-200 hover:bg-gray-800/50 border border-transparent hover:border-gray-600'
                }`}
                title="Admin Section"
              >
                <Eye className={`w-4 h-4 ${activeModule === 'admin' ? 'drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onModuleChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-700 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                        : `${item.color} hover:bg-gray-800/50 border border-transparent hover:border-gray-600`
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : ''}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Try Full WhatsApp Experience */}
              <button
                onClick={() => {
                  onFullScreenWhatsApp();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-left bg-gray-700 border border-green-500/50 text-green-300 hover:bg-gray-600 transition-all duration-200 col-span-2 shadow-lg shadow-green-500/20"
              >
                <Maximize2 className="w-4 h-4 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                <span className="text-sm font-medium">Try Full WhatsApp Experience</span>
              </button>
              
              {/* Admin Section */}
              <button
                onClick={() => {
                  onModuleChange('admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 col-span-2 ${
                  activeModule === 'admin'
                    ? 'bg-gray-700 border border-red-500/50 text-red-300 shadow-lg shadow-red-500/20'
                    : 'text-red-300 hover:text-red-200 hover:bg-gray-800/50 border border-transparent hover:border-gray-600'
                }`}
              >
                <Eye className={`w-4 h-4 ${activeModule === 'admin' ? 'drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : ''}`} />
                <span className="text-sm font-medium">Admin Section - Customer Feedback & Analytics</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};