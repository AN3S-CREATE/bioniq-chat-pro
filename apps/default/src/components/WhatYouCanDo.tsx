import React from 'react';
import { Zap, Package, Wrench, Shield, Phone, MessageSquare, Clock, CheckCircle2, Users, Settings } from 'lucide-react';

export const WhatYouCanDo: React.FC = () => {
  const features = [
    {
      id: 'speed-check',
      title: '🚀 Check Your Internet Speed',
      description: 'Get real-time speed tests and connection status for your Bioniq service',
      icon: Zap,
      color: 'bg-blue-900/50 border-blue-400/50',
      textColor: 'text-blue-200',
      examples: [
        'Check my internet speed',
        'Run a speed test',
        'How fast is my connection?',
        'Test my bandwidth'
      ]
    },
    {
      id: 'order-tracking',
      title: '📦 Track Your Orders',
      description: 'Get updates on equipment deliveries, installations, and service upgrades',
      icon: Package,
      color: 'bg-green-900/50 border-green-400/50',
      textColor: 'text-green-200',
      examples: [
        'Track my order BQ-2024-1201',
        'Where is my router?',
        'Check delivery status',
        'Order history'
      ]
    },
    {
      id: 'technical-support',
      title: '🔧 Get Technical Help',
      description: 'Troubleshoot issues, get installation guides, and schedule technician visits',
      icon: Wrench,
      color: 'bg-purple-900/50 border-purple-400/50',
      textColor: 'text-purple-200',
      examples: [
        'I need installation help',
        'My internet is slow',
        'WiFi not working',
        'Schedule a technician'
      ]
    },
    {
      id: 'account-management',
      title: '🔐 Manage Your Account',
      description: 'Update settings, check billing, secure your account with 2FA',
      icon: Shield,
      color: 'bg-orange-900/50 border-orange-400/50',
      textColor: 'text-orange-200',
      examples: [
        'Account security',
        'Update my details',
        'Check my bill',
        'Change password'
      ]
    },
    {
      id: 'customer-service',
      title: '👥 Customer Service',
      description: '24/7 support with instant FAQ answers and human agent handoff',
      icon: Users,
      color: 'bg-indigo-900/50 border-indigo-400/50',
      textColor: 'text-indigo-200',
      examples: [
        'Speak to human agent',
        'Customer support',
        'I need help',
        'Talk to someone'
      ]
    },
    {
      id: 'service-management',
      title: '⚙️ Service Management',
      description: 'Upgrade plans, manage services, and access your customer portal',
      icon: Settings,
      color: 'bg-teal-900/50 border-teal-400/50',
      textColor: 'text-teal-200',
      examples: [
        'Upgrade my plan',
        'Service options',
        'Change my package',
        'Portal access'
      ]
    }
  ];

  const benefits = [
    {
      icon: MessageSquare,
      title: 'No App Downloads',
      description: 'Use WhatsApp - already on your phone'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Get help anytime, day or night'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'End-to-end encrypted conversations'
    },
    {
      icon: Phone,
      title: 'Human Backup',
      description: 'Connect to agents when needed'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">What You Can Do with Bioniq WhatsApp Support</h2>
        <p className="text-gray-200">
          Discover all the ways our WhatsApp bot can help you manage your internet service, 
          troubleshoot issues, and get instant support.
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.id} className={`${feature.color} border rounded-lg p-6 hover:shadow-lg transition-shadow`}>
              <div className="flex items-center space-x-3 mb-4">
                <Icon className={`w-6 h-6 ${feature.textColor}`} />
                <h3 className={`font-semibold ${feature.textColor}`}>{feature.title}</h3>
              </div>
              
              <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-100 text-sm">Try saying:</h4>
                <div className="space-y-1">
                  {feature.examples.map((example, index) => (
                    <div key={index} className="text-xs text-gray-200 bg-gray-800/50 px-2 py-1 rounded">
                      "{example}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why WhatsApp Section */}
      <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-400/50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-100 mb-4">🌟 Why Use WhatsApp for Support?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/50">
                <Icon className="w-8 h-8 text-blue-200 mb-2" />
                <h4 className="font-semibold text-gray-100 mb-1">{benefit.title}</h4>
                <p className="text-sm text-gray-200">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-100 mb-4">🚀 Advanced Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-100 mb-3">Smart Automation</h4>
            <div className="space-y-2 text-sm text-gray-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Automatic speed tests and diagnostics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Proactive service notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Smart troubleshooting workflows</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Personalized recommendations</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-100 mb-3">Rich Media Support</h4>
            <div className="space-y-2 text-sm text-gray-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Share photos for technical issues</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Voice messages for complex problems</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Document sharing and downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>Interactive quick reply buttons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-blue-800/50 text-white rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎯 Ready to Get Started?</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-900/50 p-4 rounded-lg">
            <div className="font-semibold mb-2">1. Open WhatsApp</div>
            <div className="text-blue-100">Use the WhatsApp app on your phone or computer</div>
          </div>
          <div className="bg-blue-900/50 p-4 rounded-lg">
            <div className="font-semibold mb-2">2. Start Chatting</div>
            <div className="text-blue-100">Send a message to begin your support conversation</div>
          </div>
          <div className="bg-blue-900/50 p-4 rounded-lg">
            <div className="font-semibold mb-2">3. Get Instant Help</div>
            <div className="text-blue-100">Receive immediate assistance or connect with agents</div>
          </div>
        </div>
      </div>
    </div>
  );
};