import React, { useState } from 'react';
import { BarChart3, Star, TrendingUp, Users, MessageSquare, Clock, Shield, Settings, Eye, EyeOff } from 'lucide-react';

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

interface AdminPanelProps {
  feedbackSubmissions: FeedbackData[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ feedbackSubmissions }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'analytics' | 'settings'>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = () => {
    // Simple password check for demo purposes
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password. Try: admin123');
    }
  };

  const calculateAverageRating = (field: keyof FeedbackData) => {
    if (feedbackSubmissions.length === 0) return 0;
    const sum = feedbackSubmissions.reduce((acc, feedback) => acc + (feedback[field] as number), 0);
    return (sum / feedbackSubmissions.length).toFixed(1);
  };

  const getCategoryDistribution = () => {
    const categories: Record<string, number> = {};
    feedbackSubmissions.forEach(feedback => {
      categories[feedback.category] = (categories[feedback.category] || 0) + 1;
    });
    return categories;
  };

  const getRecommendationRate = () => {
    if (feedbackSubmissions.length === 0) return 0;
    const recommendations = feedbackSubmissions.filter(f => f.wouldRecommend === true).length;
    return ((recommendations / feedbackSubmissions.length) * 100).toFixed(0);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
              <p className="text-gray-600">Enter admin password to access customer feedback and analytics</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="Enter admin password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleAdminLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Access Admin Panel
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">Demo password: admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">📊 Admin Dashboard</h3>
        <p className="text-gray-700">
          Monitor WhatsApp bot performance, customer satisfaction, and system analytics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-800 text-sm">Total Users</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">1,247</div>
          <div className="text-sm text-green-600">+12% this month</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-800 text-sm">Conversations</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">3,891</div>
          <div className="text-sm text-green-600">+8% this week</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-800 text-sm">Satisfaction</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {feedbackSubmissions.length > 0 ? `${calculateAverageRating('overallRating')}/5` : '4.7/5'}
          </div>
          <div className="text-sm text-green-600">+0.2 this month</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-gray-800 text-sm">Avg Response</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">2.3s</div>
          <div className="text-sm text-green-600">-0.5s improved</div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">System Status</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">WhatsApp Bot</p>
              <p className="text-sm text-green-600">Online & Responding</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">Database</p>
              <p className="text-sm text-green-600">All Systems Operational</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">API Services</p>
              <p className="text-sm text-green-600">Running Smoothly</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">Customer Feedback Analysis</h3>
        <p className="text-purple-700">
          Detailed customer feedback and satisfaction metrics for continuous improvement.
        </p>
      </div>

      {feedbackSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Feedback Submitted Yet</h4>
          <p className="text-gray-500">
            Customer feedback will appear here once users submit their reviews.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Feedback Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {calculateAverageRating('overallRating')}/5
              </div>
              <div className="text-sm text-gray-600">Overall Rating</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {calculateAverageRating('usabilityRating')}/5
              </div>
              <div className="text-sm text-gray-600">Usability</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {calculateAverageRating('accuracyRating')}/5
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {getRecommendationRate()}%
              </div>
              <div className="text-sm text-gray-600">Would Recommend</div>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Customer Feedback</h4>
            <div className="space-y-4">
              {feedbackSubmissions.slice(-5).reverse().map((feedback, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              feedback.overallRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {feedback.testerInfo.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {feedback.testerInfo.role || 'Customer'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {feedback.timestamp ? new Date(feedback.timestamp).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  
                  {feedback.feedback && (
                    <p className="text-gray-700 text-sm mb-2">{feedback.feedback}</p>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {feedback.mostLiked && (
                      <div>
                        <span className="font-medium text-green-700">Liked: </span>
                        <span className="text-gray-600">{feedback.mostLiked}</span>
                      </div>
                    )}
                    {feedback.leastLiked && (
                      <div>
                        <span className="font-medium text-red-700">Needs Improvement: </span>
                        <span className="text-gray-600">{feedback.leastLiked}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Performance Analytics</h3>
        <p className="text-green-700">
          Detailed analytics and performance metrics for the WhatsApp bot system.
        </p>
      </div>

      {/* Usage Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Bot Performance</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Query Resolution Rate</span>
              <span className="font-semibold">94%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Response Time</span>
              <span className="font-semibold">2.3s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Human Handoff Rate</span>
              <span className="font-semibold">12%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Popular Queries</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Speed Tests</span>
              <span className="font-semibold">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Tracking</span>
              <span className="font-semibold">22%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Technical Support</span>
              <span className="font-semibold">19%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Management</span>
              <span className="font-semibold">16%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">General Inquiries</span>
              <span className="font-semibold">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">System Settings</h3>
        <p className="text-gray-600">
          Configure WhatsApp bot settings and system parameters.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Bot Configuration</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Auto-responses</p>
              <p className="text-sm text-gray-600">Enable automatic responses for common queries</p>
            </div>
            <button className="bg-green-500 relative inline-flex h-6 w-11 items-center rounded-full">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Human handoff</p>
              <p className="text-sm text-gray-600">Allow escalation to human agents</p>
            </div>
            <button className="bg-green-500 relative inline-flex h-6 w-11 items-center rounded-full">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Analytics tracking</p>
              <p className="text-sm text-gray-600">Track user interactions and performance</p>
            </div>
            <button className="bg-green-500 relative inline-flex h-6 w-11 items-center rounded-full">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Access Control</h4>
        <div className="space-y-4">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout from Admin Panel
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'feedback', label: 'Customer Feedback', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h2>
            <p className="text-gray-600">
              Monitor and manage the WhatsApp bot system performance and customer feedback.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Admin View</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'feedback' && feedbackSubmissions.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {feedbackSubmissions.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'feedback' && renderFeedback()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};