import React, { useState } from 'react';
import { Clock, MessageSquare, Star, User, Phone, Mail, CheckCircle2, AlertCircle, Users, Headphones } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  popularity: number;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  joinDate: string;
  lastContact: string;
  status: 'active' | 'inactive' | 'suspended';
  orderHistory: Array<{
    id: string;
    date: string;
    description: string;
    amount: string;
  }>;
}

export const CustomerServiceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'crm' | 'handoff' | 'feedback'>('faq');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'What makes Bioniq\'s internet "unrestricted and uncapped"?',
      answer: 'According to ISPA definition, unrestricted uncapped means no data usage caps and acceptable use policy only restricts illegal activity, not usage behavior. Unlike other providers with "soft caps" or speed throttling.',
      category: 'Service',
      popularity: 95
    },
    {
      id: '2',
      question: 'How do I monitor my internet performance?',
      answer: 'Use our state-of-the-art client portal or mobile app to access your in-depth statistics dashboard. Monitor real-time performance, usage patterns, and connection quality.',
      category: 'Technical',
      popularity: 88
    },
    {
      id: '3',
      question: 'What should I do if my internet is slow?',
      answer: 'First, restart your router and check all cable connections. Use our speed test in the client portal. If issues persist, our bot can run remote diagnostics or connect you with technical support.',
      category: 'Technical',
      popularity: 92
    },
    {
      id: '4',
      question: 'How do I access my documents and bills?',
      answer: 'All documentation is available through our document control system in the client portal. You can download invoices, contracts, installation guides, and technical specifications.',
      category: 'Account',
      popularity: 76
    },
    {
      id: '5',
      question: 'Can I upgrade my internet plan?',
      answer: 'Yes! Contact us through WhatsApp, call our support line, or use the client portal to explore upgrade options. We offer various speed tiers to match your needs.',
      category: 'Service',
      popularity: 84
    }
  ];

  const sampleCustomer: CustomerData = {
    id: 'CUST-2024-001',
    name: 'Nick Lamprecht',
    email: 'nick.lamprecht@email.com',
    phone: '+27 82 555 0123',
    plan: 'Unrestricted Uncapped 100Mbps',
    joinDate: '2022-03-15',
    lastContact: '2024-01-10',
    status: 'active',
    orderHistory: [
      {
        id: 'BQ-2024-1205',
        date: '2024-12-05',
        description: 'Fiber Installation Kit',
        amount: 'R 2,500'
      },
      {
        id: 'BQ-2024-0815',
        date: '2024-08-15',
        description: 'Router Upgrade - WiFi 6',
        amount: 'R 1,200'
      },
      {
        id: 'BQ-2022-0315',
        date: '2022-03-15',
        description: 'Initial Installation',
        amount: 'R 3,500'
      }
    ]
  };

  const renderFAQ = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">24/7 Automated Support</h3>
        <p className="text-blue-700">
          Our AI bot provides instant answers to frequently asked questions, available around the clock.
        </p>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-800 flex-1">{faq.question}</h4>
              <div className="flex items-center space-x-2 ml-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {faq.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{faq.popularity}%</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">FAQ Performance Metrics</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-gray-600">Questions Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2.3s</div>
            <div className="text-sm text-gray-600">Average Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">4.8/5</div>
            <div className="text-sm text-gray-600">User Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCRM = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Personalized Customer Interactions</h3>
        <p className="text-green-700">
          Integration with CRM system enables personalized conversations based on customer history and preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Customer Profile</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">{sampleCustomer.name}</p>
                <p className="text-sm text-gray-600">Customer ID: {sampleCustomer.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <p className="text-sm">{sampleCustomer.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <p className="text-sm">{sampleCustomer.phone}</p>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">{sampleCustomer.plan}</p>
                <p className="text-xs text-gray-600">Active since {sampleCustomer.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Last contact: {sampleCustomer.lastContact}</p>
                <p className="text-xs text-gray-600">WhatsApp support inquiry</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Payment received</p>
                <p className="text-xs text-gray-600">Monthly subscription - R 899</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Speed test completed</p>
                <p className="text-xs text-gray-600">98.5 Mbps down / 45.2 Mbps up</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-4">Order History</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Order ID</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sampleCustomer.orderHistory.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-2 font-mono text-xs">{order.id}</td>
                  <td className="py-2">{order.date}</td>
                  <td className="py-2">{order.description}</td>
                  <td className="py-2 font-semibold">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHandoff = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Seamless Human Agent Handoff</h3>
        <p className="text-orange-700">
          When the bot cannot resolve a query, it smoothly transfers the conversation with full context to human agents.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Handoff Process</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">Bot Assessment</p>
                <p className="text-xs text-gray-600">AI determines if human assistance is needed</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">Context Transfer</p>
                <p className="text-xs text-gray-600">Full conversation history shared with agent</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-sm">Agent Assignment</p>
                <p className="text-xs text-gray-600">Matched with specialist based on query type</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-sm">Seamless Transition</p>
                <p className="text-xs text-gray-600">Customer continues conversation without repetition</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Agent Availability</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Technical Support</p>
                  <p className="text-xs text-gray-600">3 agents available</p>
                </div>
              </div>
              <span className="text-xs text-green-700">~2 min wait</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Billing Support</p>
                  <p className="text-xs text-gray-600">1 agent available</p>
                </div>
              </div>
              <span className="text-xs text-yellow-700">~5 min wait</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Sales Support</p>
                  <p className="text-xs text-gray-600">2 agents available</p>
                </div>
              </div>
              <span className="text-xs text-blue-700">~1 min wait</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Handoff Statistics</h4>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">12%</div>
            <div className="text-xs text-gray-600">Conversations Escalated</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">2.1 min</div>
            <div className="text-xs text-gray-600">Average Wait Time</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">96%</div>
            <div className="text-xs text-gray-600">First Contact Resolution</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">4.9/5</div>
            <div className="text-xs text-gray-600">Agent Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">Customer Feedback Collection</h3>
        <p className="text-purple-700">
          Automated CSAT and NPS surveys are triggered after interactions to continuously improve service quality.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Satisfaction Survey</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">How satisfied were you with your support experience?</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFeedbackRating(rating)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      feedbackRating >= rating
                        ? 'bg-yellow-400 border-yellow-400'
                        : 'border-gray-300 hover:border-yellow-300'
                    }`}
                  >
                    <Star className={`w-4 h-4 mx-auto ${
                      feedbackRating >= rating ? 'text-white' : 'text-gray-400'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Additional comments (optional)</label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Submit Feedback
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Feedback Analytics</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Overall Satisfaction</span>
                <span className="text-sm font-semibold">4.7/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-semibold">4.5/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Problem Resolution</span>
                <span className="text-sm font-semibold">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Recent Testimonials</h4>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">"After Bioniq did my uncapped WiFi installation, home Internet for me and my family is the best thing ever! Thank you guys for the great service and going the extra mile in setting up my network at home!!"</p>
                <p className="text-xs text-gray-600 mt-1">- Nick Lamprecht</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">"Baie dankie vir uitstekende diens, ons as gamers kon nog nie kla oor lyn spoed of lag nie. Alex, Chris en hul span is altyd byderhand vir hulp en raad."</p>
                <p className="text-xs text-gray-600 mt-1">- Chantelle Le Roux</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'faq', label: '24/7 FAQ Support', icon: MessageSquare },
    { id: 'crm', label: 'CRM Integration', icon: Users },
    { id: 'handoff', label: 'Agent Handoff', icon: Headphones },
    { id: 'feedback', label: 'Feedback System', icon: Star }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Advanced Customer Service</h2>
        <p className="text-gray-600">
          24/7 automated support with personalized interactions, seamless agent handoff, and feedback collection.
        </p>
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
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'faq' && renderFAQ()}
      {activeTab === 'crm' && renderCRM()}
      {activeTab === 'handoff' && renderHandoff()}
      {activeTab === 'feedback' && renderFeedback()}
    </div>
  );
};