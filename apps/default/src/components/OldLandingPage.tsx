import React, { useState, useCallback, useMemo } from 'react';
import { Shield, ShoppingCart, Wrench, Users, Phone, Mail, MapPin } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { SecurityModule } from './SecurityModule';
import { CustomerServiceModule } from './CustomerServiceModule';
import { EcommerceModule } from './EcommerceModule';
import { InstallationModule } from './InstallationModule';
import { DataIntegrationDemo } from './DataIntegrationDemo';
import { RealisticWhatsAppDemo } from './RealisticWhatsAppDemo';
import { WhatYouCanDo } from './WhatYouCanDo';
import { AdminPanel } from './AdminPanel';
import { FullScreenWhatsApp } from './FullScreenWhatsApp';
import { AccessibilityTester } from './AccessibilityTester';
import { Header } from './Header';

type ModuleType = 'whatsapp-demo' | 'what-you-can-do' | 'data-integration' | 'chat' | 'security' | 'customer-service' | 'ecommerce' | 'installation' | 'admin' | 'accessibility';

interface FeedbackData {
  overallRating: number;
  usabilityRating: number;
  accuracyRating: number;
  speedRating: number;
  designRating: number;
  category: string;
  feedback: string;
  improvements: string;
  mostLiked: string;
  leastLiked: string;
  wouldRecommend: boolean | null;
  testerInfo: {
    role: string;
    experience: string;
    name: string;
    email: string;
  };
  timestamp?: number;
}

const OldLandingPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('whatsapp-demo');
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackData[]>([]);
  const [showFullScreenWhatsApp, setShowFullScreenWhatsApp] = useState(false);

  // Memoized handlers for better performance
  const handleModuleChange = useCallback((module: ModuleType) => {
    setActiveModule(module);
  }, []);

  const handleFullScreenOpen = useCallback(() => {
    setShowFullScreenWhatsApp(true);
  }, []);

  const handleFullScreenClose = useCallback(() => {
    setShowFullScreenWhatsApp(false);
  }, []);

  const handleFeedbackRequest = useCallback(() => {
    setShowFullScreenWhatsApp(false);
    // Additional feedback handling can be added here
  }, []);

  // Memoized module renderer for performance optimization
  const renderModule = useMemo(() => {
    try {
      switch (activeModule) {
        case 'whatsapp-demo':
          return <RealisticWhatsAppDemo onModuleChange={handleModuleChange} />;
        case 'what-you-can-do':
          return <WhatYouCanDo />;
        case 'data-integration':
          return <DataIntegrationDemo />;
        case 'chat':
          return <ChatInterface />;
        case 'security':
          return <SecurityModule />;
        case 'customer-service':
          return <CustomerServiceModule />;
        case 'ecommerce':
          return <EcommerceModule />;
        case 'installation':
          return <InstallationModule />;
        case 'admin':
          return <AdminPanel feedbackSubmissions={feedbackSubmissions} />;
        case 'accessibility':
          return <AccessibilityTester />;
        default:
          return <RealisticWhatsAppDemo onModuleChange={handleModuleChange} />;
      }
    } catch (error) {
      console.error('Error rendering module:', error);
      return (
        <div className="p-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">Module Error</h3>
            <p className="text-red-700">
              There was an error loading this module. Please try refreshing the page or selecting a different module.
            </p>
            <button
              onClick={() => setActiveModule('whatsapp-demo')}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Return to WhatsApp Demo
            </button>
          </div>
        </div>
      );
    }
  }, [activeModule, feedbackSubmissions, handleModuleChange]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        onFullScreenWhatsApp={handleFullScreenOpen}
      />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* Simplified Header - Only show on WhatsApp demo page */}
        {activeModule === 'whatsapp-demo' && (
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-300 mb-2 md:mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              WhatsApp Support
            </h1>
            <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto px-2">
              Get instant help with your internet service through WhatsApp. Check speeds, track orders, get technical help, manage your account, and schedule installations - all through simple chat messages.
            </p>
          </div>
        )}
        
        {/* Content Area */}
        <div className="bg-gray-800 border border-cyan-500/30 rounded-lg md:rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
          {renderModule}
        </div>

        {/* Company Info Footer */}
        <div className="mt-6 md:mt-8 bg-gray-800 border border-purple-500/30 rounded-lg shadow-lg shadow-purple-500/20 p-3 md:p-4">
          <div className="text-center mb-2 md:mb-3">
            <h3 className="text-sm md:text-base font-semibold text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">About Bioniq</h3>
            <p className="text-xs md:text-sm text-gray-300">Unrestricted, Uncapped Internet Solutions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 text-center">
            <div className="flex items-center justify-center space-x-1 md:space-x-2">
              <MapPin className="w-3 md:w-4 h-3 md:h-4 text-cyan-300 flex-shrink-0" />
              <span className="text-gray-200 text-xs md:text-sm">Steve Tshwete, Mpumalanga</span>
            </div>
            <div className="flex items-center justify-center space-x-1 md:space-x-2">
              <Phone className="w-3 md:w-4 h-3 md:h-4 text-green-300 flex-shrink-0" />
              <span className="text-gray-200 text-xs md:text-sm">24/7 Support Available</span>
            </div>
            <div className="flex items-center justify-center space-x-1 md:space-x-2">
              <Mail className="w-3 md:w-4 h-3 md:h-4 text-pink-300 flex-shrink-0" />
              <span className="text-gray-200 text-xs md:text-sm">No Fair Usage Policies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen WhatsApp Modal */}
      <FullScreenWhatsApp
        isOpen={showFullScreenWhatsApp}
        onClose={handleFullScreenClose}
        onFeedbackRequest={handleFeedbackRequest}
      />
    </div>
  );
};

export default OldLandingPage;
