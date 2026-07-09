import React, { useState } from 'react';
import { EnhancedWhatsAppInterface } from './EnhancedWhatsAppInterface';
import { FullScreenWhatsApp } from './FullScreenWhatsApp';
import { FeedbackSystem } from './FeedbackSystem';
import { MessageSquare, Users, BarChart3, Star, TrendingUp, Clock, Phone, Zap, Shield, Maximize2, ChevronDown, ChevronUp, Eye, Mic, Camera, File, Image, CheckCircle2, Wifi } from 'lucide-react';

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
}

interface RealisticWhatsAppDemoProps {
  onModuleChange?: (module: string) => void;
}

export const RealisticWhatsAppDemo: React.FC<RealisticWhatsAppDemoProps> = ({ onModuleChange }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showUnderHood, setShowUnderHood] = useState(false);
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackData[]>([]);
  const [activeTab, setActiveTab] = useState<'demo' | 'analytics'>('demo');

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    setFeedbackSubmissions(prev => [...prev, { ...feedback, timestamp: Date.now() } as any]);
    setShowFeedback(false);
  };

  const calculateAverageRating = (field: keyof FeedbackData) => {
    if (feedbackSubmissions.length === 0) return 0;
    const sum = feedbackSubmissions.reduce((acc, feedback) => acc + (feedback[field] as number), 0);
    return (sum / feedbackSubmissions.length).toFixed(1);
  };

  const getRecommendationRate = () => {
    if (feedbackSubmissions.length === 0) return 0;
    const recommendations = feedbackSubmissions.filter(f => f.wouldRecommend === true).length;
    return ((recommendations / feedbackSubmissions.length) * 100).toFixed(0);
  };

  const underHoodModules = [
    {
      id: 'security',
      name: 'Account Security',
      description: '2FA, data protection, secure access',
      icon: Shield,
      color: 'text-green-200',
      borderColor: 'border-green-400/50',
      shadowColor: 'shadow-green-400/30'
    },
    {
      id: 'customer-service',
      name: 'Customer Service',
      description: '24/7 support, FAQ, agent handoff',
      icon: Users,
      color: 'text-purple-200',
      borderColor: 'border-purple-400/50',
      shadowColor: 'shadow-purple-400/30'
    },
    {
      id: 'ecommerce',
      name: 'Order Management',
      description: 'Track orders, manage returns',
      icon: MessageSquare,
      color: 'text-pink-200',
      borderColor: 'border-pink-400/50',
      shadowColor: 'shadow-pink-400/30'
    },
    {
      id: 'installation',
      name: 'Installation Support',
      description: 'Guides, troubleshooting, scheduling',
      icon: Phone,
      color: 'text-orange-200',
      borderColor: 'border-orange-400/50',
      shadowColor: 'shadow-orange-400/30'
    },
    {
      id: 'chat',
      name: 'Chat Features',
      description: 'Advanced chat capabilities',
      icon: MessageSquare,
      color: 'text-blue-200',
      borderColor: 'border-blue-400/50',
      shadowColor: 'shadow-blue-400/30'
    },
    {
      id: 'data-integration',
      name: 'System Integration',
      description: 'Backend data & API integration',
      icon: BarChart3,
      color: 'text-indigo-200',
      borderColor: 'border-indigo-400/50',
      shadowColor: 'shadow-indigo-400/30'
    }
  ];

  const renderDemo = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Enhanced WhatsApp Interface */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-xl"></div>
          <div className="relative">
            <EnhancedWhatsAppInterface onFeedbackRequest={() => setShowFeedback(true)} />
            <button
              onClick={() => setShowFullScreen(true)}
              className="absolute top-2 right-2 bg-gray-800/90 border border-cyan-400/50 hover:bg-gray-700 text-cyan-200 p-2 rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/30"
              title="Open full screen"
            >
              <Maximize2 className="w-4 h-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Features Showcase */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-700 border border-cyan-400/50 rounded-lg p-4 shadow-lg shadow-cyan-500/20">
          <h4 className="text-lg font-semibold text-cyan-200 mb-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">🚀 Real-time Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 border border-green-400/50 p-4 rounded-lg text-center shadow-lg shadow-green-500/20">
              <Wifi className="w-8 h-8 text-green-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <h5 className="font-semibold text-green-200 text-sm mb-1">Typing Indicators</h5>
              <p className="text-xs text-gray-200">Real-time typing status with animated dots</p>
            </div>
            
            <div className="bg-gray-800 border border-blue-400/50 p-4 rounded-lg text-center shadow-lg shadow-blue-500/20">
              <CheckCircle2 className="w-8 h-8 text-blue-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
              <h5 className="font-semibold text-blue-200 text-sm mb-1">Read Receipts</h5>
              <p className="text-xs text-gray-200">Message status: sent, delivered, read</p>
            </div>
            
            <div className="bg-gray-800 border border-purple-400/50 p-4 rounded-lg text-center shadow-lg shadow-purple-500/20">
              <Clock className="w-8 h-8 text-purple-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
              <h5 className="font-semibold text-purple-200 text-sm mb-1">Online Status</h5>
              <p className="text-xs text-gray-200">Live presence with last seen timestamps</p>
            </div>
            
            <div className="bg-gray-800 border border-pink-400/50 p-4 rounded-lg text-center shadow-lg shadow-pink-500/20">
              <Zap className="w-8 h-8 text-pink-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(244,114,182,0.5)]" />
              <h5 className="font-semibold text-pink-200 text-sm mb-1">Connection Quality</h5>
              <p className="text-xs text-gray-200">Network status: excellent, good, poor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Features Showcase */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-700 border border-purple-400/50 rounded-lg p-4 shadow-lg shadow-purple-500/20">
          <h4 className="text-lg font-semibold text-purple-200 mb-4 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">📱 Interactive Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 border border-pink-400/50 p-4 rounded-lg text-center shadow-lg shadow-pink-500/20">
              <Camera className="w-8 h-8 text-pink-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(244,114,182,0.5)]" />
              <h5 className="font-semibold text-pink-200 text-sm mb-1">Photo Sharing</h5>
              <p className="text-xs text-gray-200">Share equipment photos for technical support</p>
            </div>
            
            <div className="bg-gray-800 border border-green-400/50 p-4 rounded-lg text-center shadow-lg shadow-green-500/20">
              <Mic className="w-8 h-8 text-green-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <h5 className="font-semibold text-green-200 text-sm mb-1">Voice Messages</h5>
              <p className="text-xs text-gray-200">Record voice messages for complex issues</p>
            </div>
            
            <div className="bg-gray-800 border border-blue-400/50 p-4 rounded-lg text-center shadow-lg shadow-blue-500/20">
              <File className="w-8 h-8 text-blue-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
              <h5 className="font-semibold text-blue-200 text-sm mb-1">File Sharing</h5>
              <p className="text-xs text-gray-200">Upload documents, configs, and logs</p>
            </div>
            
            <div className="bg-gray-800 border border-orange-400/50 p-4 rounded-lg text-center shadow-lg shadow-orange-500/20">
              <MessageSquare className="w-8 h-8 text-orange-200 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]" />
              <h5 className="font-semibold text-orange-200 text-sm mb-1">Quick Replies</h5>
              <p className="text-xs text-gray-200">Instant responses with smart suggestions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Look Under the Hood Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-700 border border-purple-400/50 rounded-lg p-4 shadow-lg shadow-purple-500/20">
          <button
            onClick={() => setShowUnderHood(!showUnderHood)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-200 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
              <h4 className="text-lg font-semibold text-purple-200">Look Under the Hood</h4>
            </div>
            {showUnderHood ? (
              <ChevronUp className="w-5 h-5 text-purple-200" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-200" />
            )}
          </button>
          
          {showUnderHood && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {underHoodModules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => onModuleChange?.(module.id)}
                    className={`p-4 bg-gray-800 border ${module.borderColor} rounded hover:bg-gray-700 transition-all text-left shadow-lg ${module.shadowColor}`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`w-5 h-5 ${module.color} drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]`} />
                      <h5 className={`font-semibold ${module.color} text-sm`}>{module.name}</h5>
                    </div>
                    <p className="text-sm text-gray-200 leading-tight">{module.description}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-700 border border-blue-400/50 rounded-lg p-4 shadow-lg shadow-blue-500/20">
          <h4 className="text-lg font-semibold text-blue-200 mb-4 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">🚀 Try These Commands:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-800 border border-cyan-400/50 px-4 py-3 rounded text-cyan-200">
              "Check my internet speed"
            </div>
            <div className="bg-gray-800 border border-purple-400/50 px-4 py-3 rounded text-purple-200">
              "Track my order BQ-2024-1201"
            </div>
            <div className="bg-gray-800 border border-green-400/50 px-4 py-3 rounded text-green-200">
              "I need installation help"
            </div>
            <div className="bg-gray-800 border border-pink-400/50 px-4 py-3 rounded text-pink-200">
              "Speak to human agent"
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-yellow-400/50">
            <p className="text-yellow-200 text-sm font-medium mb-2">💡 Real-time Features to Try:</p>
            <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-200">
              <div>• Watch typing indicators as you type</div>
              <div>• See message status progression (sent → delivered → read)</div>
              <div>• Notice online/offline status changes</div>
              <div>• Try voice recording with the mic button</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why WhatsApp Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-700 border border-green-400/50 rounded-lg p-4 shadow-lg shadow-green-500/20">
          <h4 className="text-lg font-semibold text-green-200 mb-4 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">🌟 Why WhatsApp?</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_3px_rgba(34,211,238,0.5)]"></div>
              <span className="text-gray-200">No app downloads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_3px_rgba(168,85,247,0.5)]"></div>
              <span className="text-gray-200">Real-time indicators</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full shadow-[0_0_3px_rgba(34,197,94,0.5)]"></div>
              <span className="text-gray-200">24/7 availability</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-300 rounded-full shadow-[0_0_3px_rgba(244,114,182,0.5)]"></div>
              <span className="text-gray-200">End-to-end encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full shadow-[0_0_3px_rgba(59,130,246,0.5)]"></div>
              <span className="text-gray-200">Read receipts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-300 rounded-full shadow-[0_0_3px_rgba(251,146,60,0.5)]"></div>
              <span className="text-gray-200">Typing indicators</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-300 rounded-full shadow-[0_0_3px_rgba(129,140,248,0.5)]"></div>
              <span className="text-gray-200">Online presence</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-300 rounded-full shadow-[0_0_3px_rgba(45,212,191,0.5)]"></div>
              <span className="text-gray-200">Human handoff</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gray-700 border border-purple-400/50 rounded-lg p-4 shadow-lg shadow-purple-500/20">
        <h3 className="text-lg font-bold text-purple-200 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">📊 Feedback Analytics</h3>
        <p className="text-sm text-gray-200">
          Customer feedback and usage insights to help improve the WhatsApp bot experience.
        </p>
      </div>

      {feedbackSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-cyan-200 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <h4 className="text-lg font-semibold text-cyan-200 mb-2">No Feedback Yet</h4>
          <p className="text-sm text-gray-200 mb-4 px-4">
            Try the enhanced WhatsApp bot with real-time features and submit feedback to see analytics here.
          </p>
          <button
            onClick={() => setShowFeedback(true)}
            className="px-6 py-3 bg-gray-700 border border-cyan-400/50 text-cyan-200 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm shadow-lg shadow-cyan-500/30"
          >
            Provide Feedback
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-700 border border-yellow-400/50 rounded-lg p-3 shadow-lg shadow-yellow-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-200 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
                <span className="font-semibold text-yellow-200 text-sm">Overall</span>
              </div>
              <div className="text-xl font-bold text-yellow-200">
                {calculateAverageRating('overallRating')}/5
              </div>
              <div className="text-xs text-gray-200">{feedbackSubmissions.length} reviews</div>
            </div>

            <div className="bg-gray-700 border border-blue-400/50 rounded-lg p-3 shadow-lg shadow-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-200 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                <span className="font-semibold text-blue-200 text-sm">Usability</span>
              </div>
              <div className="text-xl font-bold text-blue-200">
                {calculateAverageRating('usabilityRating')}/5
              </div>
              <div className="text-xs text-gray-200">Ease of use</div>
            </div>

            <div className="bg-gray-700 border border-green-400/50 rounded-lg p-3 shadow-lg shadow-green-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-200 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                <span className="font-semibold text-green-200 text-sm">Accuracy</span>
              </div>
              <div className="text-xl font-bold text-green-200">
                {calculateAverageRating('accuracyRating')}/5
              </div>
              <div className="text-xs text-gray-200">Response quality</div>
            </div>

            <div className="bg-gray-700 border border-purple-400/50 rounded-lg p-3 shadow-lg shadow-purple-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-200 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
                <span className="font-semibold text-purple-200 text-sm">Speed</span>
              </div>
              <div className="text-xl font-bold text-purple-200">
                {calculateAverageRating('speedRating')}/5
              </div>
              <div className="text-xs text-gray-200">Response time</div>
            </div>
          </div>

          {/* Satisfaction rate */}
          <div className="bg-gray-700 border border-green-400/50 rounded-lg p-4 shadow-lg shadow-green-500/20">
            <h4 className="text-sm font-semibold text-green-200 mb-3 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">Customer Satisfaction</h4>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-green-200 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{getRecommendationRate()}%</div>
              <div className="text-gray-200">would recommend this service</div>
            </div>
          </div>

          {/* Recent feedback */}
          {feedbackSubmissions.length > 0 && (
            <div className="bg-gray-700 border border-cyan-400/50 rounded-lg p-4 shadow-lg shadow-cyan-500/20">
              <h4 className="text-sm font-semibold text-cyan-200 mb-3 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Recent Feedback</h4>
              <div className="space-y-3">
                {feedbackSubmissions.slice(-2).reverse().map((feedback, index) => (
                  <div key={index} className="border-l-4 border-cyan-400 pl-3 bg-gray-800/50 p-3 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              feedback.overallRating >= star ? 'text-yellow-200 fill-current drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]' : 'text-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-200">
                        {feedback.testerInfo.name || 'Customer'}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm">{feedback.feedback || 'No detailed feedback provided'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'demo', label: 'Enhanced WhatsApp Support', icon: MessageSquare, color: 'text-cyan-200' },
    { id: 'analytics', label: 'Customer Feedback', icon: BarChart3, color: 'text-purple-200' }
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-600 mb-4 md:mb-6">
        <nav className="flex space-x-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? `border-cyan-400 ${tab.color} drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]`
                    : 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'analytics' && feedbackSubmissions.length > 0 && (
                  <span className="bg-purple-800/50 border border-purple-400/50 text-purple-200 text-xs px-2 py-1 rounded-full shadow-lg shadow-purple-500/20">
                    {feedbackSubmissions.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'demo' && renderDemo()}
      {activeTab === 'analytics' && renderAnalytics()}

      {/* Full Screen WhatsApp Modal */}
      <FullScreenWhatsApp
        isOpen={showFullScreen}
        onClose={() => setShowFullScreen(false)}
        onFeedbackRequest={() => {
          setShowFullScreen(false);
          setShowFeedback(true);
        }}
      />

      {/* Feedback Modal */}
      <FeedbackSystem
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};