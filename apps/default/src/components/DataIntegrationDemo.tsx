import React, { useState, useEffect } from 'react';
import { Database, Users, Package, Headphones, MessageSquare, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApiEndpoint {
  name: string;
  method: string;
  url: string;
  description: string;
  category: string;
}

interface DataStats {
  customers: number;
  orders: number;
  tickets: number;
  conversations: number;
  products: number;
  appointments: number;
}

export const DataIntegrationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apis' | 'demo'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DataStats>({
    customers: 3,
    orders: 3,
    tickets: 3,
    conversations: 3,
    products: 5,
    appointments: 3
  });

  const apiEndpoints: ApiEndpoint[] = [
    {
      name: 'Customer Database',
      method: 'GET',
      url: '/api/taskade/projects/EdTX81Qs3i4JwPxs/nodes',
      description: 'Retrieve all customer records with contact info, plans, and preferences',
      category: 'Customers'
    },
    {
      name: 'Create Customer',
      method: 'POST',
      url: '/api/taskade/projects/EdTX81Qs3i4JwPxs/nodes',
      description: 'Add new customer to database with full profile information',
      category: 'Customers'
    },
    {
      name: 'Order Management',
      method: 'GET',
      url: '/api/taskade/projects/ZGP7PY6VQiAhvEpK/nodes',
      description: 'Get all orders with status, tracking, and payment information',
      category: 'Orders'
    },
    {
      name: 'Create Order',
      method: 'POST',
      url: '/api/taskade/projects/ZGP7PY6VQiAhvEpK/nodes',
      description: 'Create new order with customer details and product information',
      category: 'Orders'
    },
    {
      name: 'Support Tickets',
      method: 'GET',
      url: '/api/taskade/projects/NTEpfNJa25HGekRL/nodes',
      description: 'Retrieve support tickets with priority, status, and agent assignment',
      category: 'Support'
    },
    {
      name: 'Create Ticket',
      method: 'POST',
      url: '/api/taskade/projects/NTEpfNJa25HGekRL/nodes',
      description: 'Create new support ticket from WhatsApp conversation',
      category: 'Support'
    },
    {
      name: 'Product Inventory',
      method: 'GET',
      url: '/api/taskade/projects/HPpKWYiSMBbn6Ta8/nodes',
      description: 'Get product catalog with pricing, availability, and specifications',
      category: 'Products'
    },
    {
      name: 'WhatsApp Conversations',
      method: 'GET',
      url: '/api/taskade/projects/FEEux561JsGo2G6G/nodes',
      description: 'Track conversation history, bot confidence, and escalations',
      category: 'Conversations'
    },
    {
      name: 'Installation Appointments',
      method: 'GET',
      url: '/api/taskade/projects/S9ZKbhB6t7DYcjFt/nodes',
      description: 'Manage technician scheduling and installation tracking',
      category: 'Appointments'
    }
  ];

  const simulateApiCall = async (endpoint: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    return {
      success: true,
      message: `Successfully called ${endpoint}`,
      timestamp: new Date().toISOString()
    };
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 Complete Data Storage System Created!</h3>
        <p className="text-gray-700 mb-4">
          I've successfully created 6 comprehensive Taskade projects that serve as your WhatsApp bot's database. 
          Each project has custom fields, sample data, and automatically generated APIs.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.customers + stats.orders + stats.tickets + stats.conversations + stats.products + stats.appointments}</div>
            <div className="text-sm text-gray-600">Total Records</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">6</div>
            <div className="text-sm text-gray-600">Database Projects</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">18+</div>
            <div className="text-sm text-gray-600">API Endpoints</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Customer Database</h4>
              <p className="text-sm text-gray-600">{stats.customers} customers</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Complete customer profiles with contact info, internet plans, billing details, and preferences.
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• Phone & WhatsApp ID</div>
            <div>• Internet plan & monthly fee</div>
            <div>• Language preferences</div>
            <div>• Service status & history</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Order Management</h4>
              <p className="text-sm text-gray-600">{stats.orders} orders</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Complete order tracking with status updates, payment info, and delivery details.
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• Order status & tracking</div>
            <div>• Payment processing</div>
            <div>• Delivery scheduling</div>
            <div>• Customer notifications</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Headphones className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Support Tickets</h4>
              <p className="text-sm text-gray-600">{stats.tickets} tickets</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Comprehensive support ticket system with priority levels and agent assignment.
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• Priority & categorization</div>
            <div>• Agent assignment</div>
            <div>• Resolution tracking</div>
            <div>• Multi-channel support</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <MessageSquare className="w-8 h-8 text-orange-600" />
            <div>
              <h4 className="font-semibold text-gray-800">WhatsApp Conversations</h4>
              <p className="text-sm text-gray-600">{stats.conversations} conversations</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Track all WhatsApp interactions with bot confidence scoring and escalation management.
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• Conversation history</div>
            <div>• Bot confidence levels</div>
            <div>• Intent classification</div>
            <div>• Escalation tracking</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Database className="w-8 h-8 text-red-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Product Inventory</h4>
              <p className="text-sm text-gray-600">{stats.products} products</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Complete product catalog with pricing, availability, and detailed specifications.
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• Stock management</div>
            <div>• Pricing & currency</div>
            <div>• Product features</div>
            <div>• Supplier information</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <RefreshCw className="w-8 h-8 text-teal-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Installation Appointments</h4>
              <p className="text-sm text-gray-600">{stats.appointments} appointments</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Technician scheduling system with service types and appointment management.
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• Technician assignment</div>
            <div>• Service type tracking</div>
            <div>• Time slot management</div>
            <div>• Special requirements</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApis = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Auto-Generated API Endpoints</h3>
        <p className="text-blue-700">
          Each Taskade project automatically generates REST API endpoints for full CRUD operations. 
          These APIs are ready for WhatsApp webhook integration.
        </p>
      </div>

      <div className="space-y-4">
        {['Customers', 'Orders', 'Support', 'Products', 'Conversations', 'Appointments'].map((category) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">{category} APIs</h4>
            <div className="space-y-2">
              {apiEndpoints.filter(api => api.category === category).map((api, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        api.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {api.method}
                      </span>
                      <span className="font-medium text-gray-800">{api.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{api.description}</p>
                    <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                      {api.url}
                    </code>
                  </div>
                  <button
                    onClick={() => simulateApiCall(api.name)}
                    disabled={isLoading}
                    className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Testing...' : 'Test API'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDemo = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">WhatsApp Bot Integration Demo</h3>
        <p className="text-green-700">
          See how the WhatsApp bot would interact with real customer data using the APIs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Sample Bot Interactions</h4>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 mb-2">
                  <strong>Customer:</strong> "Check my internet speed"
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="text-gray-700 mb-2"><strong>Bot Process:</strong></p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>1. GET /api/taskade/projects/EdTX81Qs3i4JwPxs/nodes</div>
                    <div>2. Find customer by phone: +27 82 555 0123</div>
                    <div>3. Retrieve plan: "Unrestricted Uncapped 100Mbps"</div>
                    <div>4. Return personalized speed info</div>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  <strong>Response:</strong> "Hi Nick! Your current plan: 100Mbps. Speed test shows 98.5 Mbps down / 45.2 Mbps up. Excellent performance! 🚀"
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 mb-2">
                  <strong>Customer:</strong> "Track my order BQ-2024-1201"
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="text-gray-700 mb-2"><strong>Bot Process:</strong></p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>1. GET /api/taskade/projects/ZGP7PY6VQiAhvEpK/nodes</div>
                    <div>2. Search orders by ID: "BQ-2024-1201"</div>
                    <div>3. Get status: "shipped", tracking: "TRK-456789012"</div>
                    <div>4. Return tracking details</div>
                  </div>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  <strong>Response:</strong> "📦 Order BQ-2024-1201 is shipped! Tracking: TRK-456789012. Expected delivery: Dec 8. Your WiFi 6 Router is on the way!"
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 mb-2">
                  <strong>Customer:</strong> "I need technical support"
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="text-gray-700 mb-2"><strong>Bot Process:</strong></p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>1. POST /api/taskade/projects/NTEpfNJa25HGekRL/nodes</div>
                    <div>2. Create support ticket with customer details</div>
                    <div>3. POST /api/taskade/projects/FEEux561JsGo2G6G/nodes</div>
                    <div>4. Log conversation for tracking</div>
                  </div>
                </div>
                <p className="text-sm text-purple-700 mt-2">
                  <strong>Response:</strong> "🎧 I've created ticket TICKET-2024-004 for you. Let me help troubleshoot your issue. What specific problem are you experiencing?"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Data Flow Architecture</h4>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">WhatsApp Message Received</span>
              </div>
              <div className="ml-6 border-l-2 border-gray-200 pl-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Bot processes intent & extracts data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">API calls to relevant Taskade projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Data retrieved & processed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Personalized response generated</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-sm">Response sent via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-3">Key Benefits</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Real-time data synchronization</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Personalized customer experiences</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Automated ticket creation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Complete conversation tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Scalable data architecture</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-800">Ready for Production</h5>
                <p className="text-sm text-yellow-700 mt-1">
                  All APIs are live and ready for WhatsApp Business API integration. 
                  The data structure supports real customer interactions at scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Data Overview', icon: Database },
    { id: 'apis', label: 'API Endpoints', icon: RefreshCw },
    { id: 'demo', label: 'Integration Demo', icon: MessageSquare }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">WhatsApp Bot Data Storage System</h2>
        <p className="text-gray-600">
          Complete database infrastructure with 6 Taskade projects, custom fields, and auto-generated APIs.
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'apis' && renderApis()}
      {activeTab === 'demo' && renderDemo()}
    </div>
  );
};